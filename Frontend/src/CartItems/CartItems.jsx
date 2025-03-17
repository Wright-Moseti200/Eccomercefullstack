/* eslint-disable array-callback-return */
import { useContext } from 'react';
import React from 'react'
import "./CartItems.css";
import { ShopContext } from '../shopcontext';
import remove_icon from "../Assets/cart_cross_icon.png";
const CartItems = () => {
    const {all_product,cartItems,removeFromCart,getTotalCartAmount} = useContext(ShopContext);
  return (
    <div className='cartitems'>
      <div className='cartitems-format-main'>
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr/>
        {all_product.map((e)=>
        {
            if(cartItems[e.id]>0)
            {
            return (
              <div key={e.id}>
                <div className='cartitems-format cartitems-format-main'>
                  <img src={e.image} alt="" className='cartitems-product-icon'/>
                  <p className='cart-item-name'>{e.name}</p>
                  <p className='cart-item-price'>${e.new_price}</p>
                  <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                  <p className='cart-item-total'>${e.new_price*cartItems[e.id]}</p>
                  <img 
                    src={remove_icon} 
                    onClick={() => removeFromCart(e.id)} 
                    alt='remove'
                    className='cartitems-remove-icon'
                  />
                </div>
                <hr/>
              </div>
            );
        }
        return null;
        })}
        <hr/>
        <div className='cartitems-down'>
        <div className='cartitems-total'>
         <h1>Cart Totals</h1>
         <div>
            <div className='cartitems-total-item'>
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
            </div>
            <hr/>
            <div className='cartitems-total-item'>
            <p>Shipping fee</p>
            <p>Free</p>
            </div>
            <hr/>
            <div className='cartitems-total-item'>
            <h3>Total</h3>
            <h3>${getTotalCartAmount()}</h3>
            </div>
         </div>
         <button>PROCEED TO CHECKOUT</button>
        </div>
        <div className='cartitems-promocode'>
            <p>If you have a promo code, Enter it here</p>
            <div className='cartitems-promocode'>
<input type="text" placeholder='promo code'/>
<button>Submit</button>
            </div>
        </div>
        </div>
    </div>
  );
}

export default CartItems
