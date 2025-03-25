/* eslint-disable array-callback-return */
import { useContext, useState } from 'react';
import React from 'react';
import "./CartItems.css";
import { ShopContext } from '../shopcontext';
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
    const { all_product, cartItems, removeFromCart, getTotalCartAmount, user } = useContext(ShopContext);
    const [promoCode, setPromoCode] = useState('');

    const handleCheckout = async () => {
        if (!localStorage.getItem('auth-token')) {
            alert('Please login to checkout');
            return;
        }

        try {
            const response = await fetch('https://eccomercebackend-u1ce.onrender.com/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({
                    cartItems
                })
            });

            if (!response.ok) {
                throw new Error('Payment failed');
            }

            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed. Please try again.');
        }
    };

    const handlePromoCode = (e) => {
        setPromoCode(e.target.value);
    };

    const submitPromoCode = () => {
        // Add promo code logic here
        alert('Promo code feature coming soon!');
    };

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
            {all_product?.map((e) => {
                if (cartItems[e.id] > 0) {
                    return (
                        <div key={e.id}>
                            <div className='cartitems-format cartitems-format-main'>
                                <img src={e.image} alt={e.name} className='cartitems-product-icon'/>
                                <p className='cart-item-name'>{e.name}</p>
                                <p className='cart-item-price'>${e.new_price}</p>
                                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                <p className='cart-item-total'>${(e.new_price * cartItems[e.id]).toFixed(2)}</p>
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
            <div className='cartitems-down'>
                <div className='cartitems-total'>
                    <h1>Cart Totals</h1>
                    <div>
                        <div className='cartitems-total-item'>
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount().toFixed(2)}</p>
                        </div>
                        <hr/>
                        <div className='cartitems-total-item'>
                            <p>Shipping fee</p>
                            <p>Free</p>
                        </div>
                        <hr/>
                        <div className='cartitems-total-item'>
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount().toFixed(2)}</h3>
                        </div>
                    </div>
                    <button 
                        onClick={handleCheckout} 
                        className="checkout-button"
                        disabled={getTotalCartAmount() <= 0}
                    >
                        PROCEED TO CHECKOUT
                    </button>
                </div>
                <div className='cartitems-promocode'>
                    <p>If you have a promo code, Enter it here</p>
                    <div className='cartitems-promobox'>
                        <input 
                            type="text" 
                            placeholder='promo code'
                            value={promoCode}
                            onChange={handlePromoCode}
                        />
                        <button onClick={submitPromoCode}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItems;
