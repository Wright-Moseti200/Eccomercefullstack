import React, { useState, useEffect } from 'react';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('https://eccomercebackend-u1ce.onrender.com/admin/orders');
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const generateReceipt = async (orderId) => {
        try {
            const response = await fetch(`https://eccomercebackend-u1ce.onrender.com/admin/orders/${orderId}/receipt`);
            const receipt = await response.json();
            printReceipt(receipt);
        } catch (error) {
            console.error('Error generating receipt:', error);
        }
    };

    const printReceipt = (receipt) => {
        const receiptWindow = window.open('', '_blank');
        receiptWindow.document.write(`
            <html>
                <head>
                    <title>Order Receipt</title>
                    <style>
                        body { font-family: Arial; padding: 20px; }
                        .receipt { max-width: 500px; margin: 0 auto; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .items { margin: 20px 0; }
                        .item { display: flex; justify-content: space-between; margin: 10px 0; }
                        .total { text-align: right; font-weight: bold; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        <div class="header">
                            <h2>Order Receipt</h2>
                            <p>Order #${receipt.orderNumber}</p>
                            <p>Date: ${new Date(receipt.date).toLocaleString()}</p>
                        </div>
                        <div class="customer">
                            <p>Customer: ${receipt.customer.name}</p>
                            <p>Email: ${receipt.customer.email}</p>
                        </div>
                        <div class="items">
                            ${receipt.items.map(item => `
                                <div class="item">
                                    <span>${item.name} x${item.quantity}</span>
                                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="total">
                            Total: $${receipt.total.toFixed(2)}
                        </div>
                    </div>
                </body>
            </html>
        `);
        receiptWindow.document.close();
        receiptWindow.print();
    };

    if (loading) {
        return <div>Loading orders...</div>;
    }

    return (
        <div className="orders-container">
            <h2>Customer Orders</h2>
            <div className="orders-list">
                {orders.map(order => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <h3>Order #{order._id}</h3>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="order-details">
                            <p>Customer: {order.userId.name}</p>
                            <p>Email: {order.userId.email}</p>
                            <div className="order-items">
                                {order.products.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span>{item.name}</span>
                                        <span>x{item.quantity}</span>
                                        <span>${item.price}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="order-total">Total: ${order.total}</p>
                        </div>
                        <button 
                            onClick={() => generateReceipt(order._id)}
                            className="generate-receipt-btn"
                        >
                            Generate Receipt
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;