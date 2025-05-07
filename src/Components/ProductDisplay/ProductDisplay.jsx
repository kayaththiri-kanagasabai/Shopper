import React, { useContext } from 'react'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import './ProductDisplay.css'
import { ShopContext } from '../../Context/ShopContext'

const ProductDisplay = (props) => {
  const {product}=props;
  const {addToCart}=useContext(ShopContext);


  return (
    <div className='productdisplay'>


       {/*Left Product Image Gallery  */}
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" /> 
        </div>
        <div className="productdisplay-img">
          <img className='productdisplay-main-img' src={product.image} alt="" />
        </div>
      </div>


  {/* Right Product Details */}
  <div className="productdisplay-right">
        <h1>{product.name}</h1>

        {/*Star Ratings */}
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>

        {/* Price Section */}
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-prices-old">${product.old_price}</div>
          <div className="productdisplay-right-prices-new">${product.new_price}</div>
        </div>

        {/* Product Description */}
        <div className="productdisplay-right-description">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio beatae voluptas laudantium, culpa cupiditate architecto nemo amet animi possimus laborum nihil perspiciatis. Tempore quaerat repellendus ex cupiditate deleniti nisi quisquam magni, possimus maiores? Provident, soluta! Possimus hic dolores aliquam quibusdam rerum? Ex deleniti ullam praesentium tempore quod voluptate possimus obcaecati.
        </div>

        {/* Size Selection */}
        <div className="productdisplay-right-size">
          <h1>Select size</h1>
          <div className="productdisplay-right-sizes">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
            <div>XXL</div>
          </div>
        </div>

        {/* Add to Cart */}
        <button onClick={()=>{addToCart(product.id)}} >Add to cart</button>

        {/* Category,Tags */}
        <p className='productdisplay-right-category'><span>Category : </span>Women, T-Shirt, Crop Top</p>
        <p className='productdisplay-right-category'><span>Tags : </span>Modern, Latest</p>
      </div>





    </div>
  )
}

export default ProductDisplay