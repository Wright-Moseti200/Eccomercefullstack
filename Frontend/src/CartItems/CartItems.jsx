/* eslint-disable array-callback-return */
import { useContext, useState } from 'react';
import React from 'react';
import "./CartItems.css";
import { ShopContext } from '../shopcontext';
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
    const { all_product, cartItems, removeFromCart, getTotalCartAmount } = useContext(ShopContext);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);

    const handleCheckout = async () => {
        if (!localStorage.getItem('auth-token')) {
            alert('Please login to checkout');
            return;
        }

        // Get phone number from user
        const phoneNumber = prompt('Enter your M-Pesa phone number (e.g., 0712345678):');
        if (!phoneNumber) return;

        try {
            setLoading(true);
            setPaymentStatus('initiating');

            const response = await fetch('https://eccomercebackend-u1ce.onrender.com/initiate-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({
                    phoneNumber,
                    amount: getTotalCartAmount(),
                    cartItems
                })
            });

            const data = await response.json();
            
            if (data.error) {
                setPaymentStatus('failed');
                alert(data.error);
            } else {
                setPaymentStatus('pending');
                alert(data.message);
                if (data.checkoutRequestId) {
                    checkPaymentStatus(data.checkoutRequestId);
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setPaymentStatus('failed');
            alert('Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const checkPaymentStatus = async (checkoutRequestId) => {
        try {
            const response = await fetch(`https://eccomercebackend-u1ce.onrender.com/payment-status/${checkoutRequestId}`, {
                headers: {
                    'auth-token': localStorage.getItem('auth-token')
                }
            });
            const data = await response.json();

            if (data.status === 'completed') {
                setPaymentStatus('completed');
                alert('Payment successful! Thank you for your purchase.');
                window.location.reload(); // Refresh to show empty cart
            } else if (data.status === 'failed') {
                setPaymentStatus('failed');
                alert('Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Status check error:', error);
        }
    };

    const getButtonText = () => {
        if (loading) return 'Processing...';
        switch (paymentStatus) {
            case 'initiating':
                return 'Initiating Payment...';
            case 'pending':
                return 'Check your phone...';
            case 'completed':
                return 'Payment Successful!';
            case 'failed':
                return 'Try Again';
            default:
                return 'PROCEED TO CHECKOUT';
        }
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
                            <p>Shipping Fee</p>
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
                        className={`checkout-button ${paymentStatus}`}
                        disabled={loading || getTotalCartAmount() <= 0}
                    >
                        {getButtonText()}
                    </button>
                </div>
                <div className='cartitems-promocode'>
                    <p>If you have a promo code, Enter it here</p>
                    <div className='cartitems-promobox'>
                        <input/>
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItems;
