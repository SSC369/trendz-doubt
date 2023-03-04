import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusProductDetails = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  notFound: 'NOTFOUND',
}

class ProductItemDetails extends Component {
  state = {
    productData: [],
    responseStatus: apiStatusProductDetails.initial,
    productCount: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({responseStatus: apiStatusProductDetails.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()

      const formattedDataSimilarProducts = data.similar_products.map(
        eachData => ({
          availability: eachData.availability,
          brand: eachData.brand,
          description: eachData.description,
          id: eachData.id,
          imageUrl: eachData.image_url,
          price: eachData.price,
          rating: eachData.rating,
          style: eachData.style,
          title: eachData.title,
          totalReviews: eachData.total_reviews,
        }),
      )

      const formattedData = {
        availability: data.availability,
        brand: data.brand,
        title: data.title,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        totalReviews: data.total_reviews,
        price: data.price,
        rating: data.rating,
        similarProducts: formattedDataSimilarProducts,
      }

      this.setState({
        productData: formattedData,
        responseStatus: apiStatusProductDetails.success,
      })
    }
    if (response.status === 404) {
      this.setState({responseStatus: apiStatusProductDetails.notFound})
    }
  }

  increaseCount = () => {
    this.setState(prevState => ({
      productCount: prevState.productCount + 1,
    }))
  }

  decreaseCount = () => {
    const {productCount} = this.state
    if (productCount > 1) {
      this.setState(prevState => ({
        productCount: prevState.productCount - 1,
      }))
    }
  }

  renderLoading = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderNotFoundView = () => (
    <div className="product-item-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-view-image"
      />
      <h1 className="error-view-heading">Product Not Found</h1>
      <Link to="/products">
        <button className="continue-shopping-button" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductDetails = () => {
    const {productData, productCount} = this.state
    const {
      availability,
      brand,
      imageUrl,
      price,
      title,
      totalReviews,
      rating,
      similarProducts,
      description,
    } = productData
    return (
      <div className="product-item-container">
        <div className="product-image-container">
          <img src={imageUrl} alt="product" className="product-item-image" />
          <div className="product-item-details-container">
            <h1 className="product-item-name">{title}</h1>
            <p className="product-price">{`Rs ${price}/-`}</p>
            <div className="review-rating-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-icon"
                />
              </div>
              <p className="reviews">{`${totalReviews} Reviews`}</p>
            </div>
            <p className="description">{description}</p>
            <div className="available-container">
              <span className="available">Available:</span>
              <p className="span-element">{availability}</p>
            </div>

            <div className="available-container">
              <span className="available">Brand:</span>
              <p className="span-element">{brand}</p>
            </div>

            <div className="add-to-cart-container">
              <div className="product-add-range-container">
                <button
                  type="button"
                  className="plus-minus-button"
                  onClick={this.decreaseCount}
                  data-testid="minus"
                >
                  <BsDashSquare />
                </button>
                <p className="count">{productCount}</p>
                <button
                  type="button"
                  className="plus-minus-button"
                  data-testid="plus"
                  onClick={this.increaseCount}
                >
                  <BsPlusSquare />
                </button>
              </div>
              <button type="button" className="add-to-cart-button">
                Add To Cart
              </button>
            </div>
          </div>
        </div>
        <div className="similar-products-main-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-container">
            {similarProducts.map(eachProduct => (
              <SimilarProductItem product={eachProduct} key={eachProduct.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProductItemDetails = () => {
    const {responseStatus} = this.state
    switch (responseStatus) {
      case apiStatusProductDetails.success:
        return this.renderProductDetails()
      case apiStatusProductDetails.inProgress:
        return this.renderLoading()
      case apiStatusProductDetails.notFound:
        return this.renderNotFoundView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductItemDetails()}
      </>
    )
  }
}

export default ProductItemDetails
