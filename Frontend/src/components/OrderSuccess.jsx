import React, { useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShopContext } from '../shopcontext';
import "../index.css";

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const { clearCart } = useContext(ShopContext);
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            // Clear cart after successful payment
            clearCart();
            localStorage.removeItem('cartItems');
        }
    }, [sessionId, clearCart]);

    return (
        <div className="order-success">
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase.</p>
            <p>Your order has been confirmed.</p>
            <Link to="/" className="continue-shopping">
                Continue Shopping
            </Link>
        </div>
    );
};

export default OrderSuccess;