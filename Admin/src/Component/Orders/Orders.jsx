import React, { useState, useEffect } from 'react';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('https://eccomercebackend-u1ce.onrender.com/admin/orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const generateReceipt = (order) => {
        const receiptContent = `
            RECEIPT
            --------
            Order ID: ${order.mpesaRequestId}
            Customer: ${order.userName}
            Phone: ${order.phoneNumber}
            Amount: $${order.amount}
            Date: ${new Date(order.createdAt).toLocaleString()}
            Status: ${order.status}
            Transaction ID: ${order.transactionId || 'Pending'}
            
            Items:
            ${Object.entries(order.cartItems)
                .filter(([_, quantity]) => quantity > 0)
                .map(([productId, quantity]) => 
                    `- ${quantity}x Product #${productId}`
                ).join('\n')}
        `;

        // Create and trigger download
        const element = document.createElement('a');
        const file = new Blob([receiptContent], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `receipt_${order.mpesaRequestId}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="orders">
            <h2>Customer Orders</h2>
            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order._id} className={`order-item ${order.status}`}>
                        <div className="order-header">
                            <h3>Order #{order.mpesaRequestId}</h3>
                            <span className={`status ${order.status}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="order-details">
                            <p><strong>Customer:</strong> {order.userName}</p>
                            <p><strong>Phone:</strong> {order.phoneNumber}</p>
                            <p><strong>Amount:</strong> ${order.amount}</p>
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            {order.transactionId && (
                                <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                            )}
                        </div>
                        <button 
                            onClick={() => generateReceipt(order)}
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