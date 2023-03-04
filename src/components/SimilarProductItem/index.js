import './index.css'

const SimilarProductItem = props => {
  const {product} = props
  const {imageUrl, title, brand, price, rating} = product
  return (
    <li className="each-similar-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-image"
      />
      <p className="similar-product-name">{title}</p>
      <p className="similar-product-brand">{`by ${brand}`}</p>
      <div className="price-rating-container">
        <p className="similar-product-price">{`Rs ${price}/-`}</p>
        <div className="similar-product-rating-container">
          <p className="similar-product-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-product-star-icon"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
