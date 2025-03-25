import React, { useState, useEffect } from 'react';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('https://eccomercebackend-u1ce.onrender.com/admin/orders', {
                headers: {
                    'auth-token': localStorage.getItem('admin-token')
                }
            });
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const generateReceipt = async (orderId) => {
        try {
            const response = await fetch(`https://eccomercebackend-u1ce.onrender.com/admin/orders/${orderId}/receipt`, {
                headers: {
                    'auth-token': localStorage.getItem('admin-token')
                }
            });
            const data = await response.json();
            // Handle receipt generation (e.g., download PDF or display modal)
            console.log('Receipt:', data.receipt);
        } catch (error) {
            console.error('Error generating receipt:', error);
        }
    };

    return (
        <div className="orders">
            <h2>Customer Orders</h2>
            <div className="orders-list">
                {orders.map(order => (
                    <div key={order._id} className="order-item">
                        <div className="order-header">
                            <h3>Order #{order._id}</h3>
                            <span>{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div className="order-details">
                            <p>Customer: {order.user.name}</p>
                            <p>Email: {order.user.email}</p>
                            <p>Total: ${order.total}</p>
                        </div>
                        <button onClick={() => generateReceipt(order._id)}>
                            Generate Receipt
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;