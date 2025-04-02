import React, { useState, useEffect } from 'react';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('https://eccomercebackend-u1ce.onrender.com/admin/orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            setError('Failed to fetch orders');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateReceipt = async (order) => {
        try {
            // Add loading state for feedback
            setLoading(true);

            // Fetch products with error handling
            let products = [];
            try {
                const response = await fetch('https://eccomercebackend-u1ce.onrender.com/allproducts');
                if (!response.ok) throw new Error('Failed to fetch products');
                products = await response.json();
            } catch (error) {
                console.error('Product fetch error:', error);
                products = []; // Continue with empty products array
            }

            // Process cart items with fallback for missing products
            const orderItems = Object.entries(order.cartItems || {})
                .filter(([_, quantity]) => quantity > 0)
                .map(([productId, quantity]) => {
                    const product = products.find(p => p.id === parseInt(productId));
                    return {
                        name: product ? product.name : `Product ID: ${productId}`,
                        price: product ? product.new_price : 0,
                        quantity: quantity,
                        total: (product ? product.new_price : 0) * quantity,
                        category: product ? product.category : 'N/A'
                    };
                });

            const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);

            // Generate receipt content with error handling for undefined values
            const receiptContent = `
==========================================
           E-COMMERCE STORE
          OFFICIAL RECEIPT
==========================================
Date: ${new Date(order.createdAt || Date.now()).toLocaleString()}
Receipt #: ${order.mpesaRequestId || 'N/A'}
Transaction ID: ${order.transactionId || 'Pending'}

CUSTOMER INFORMATION
------------------------------------------
Name: ${order.userName || 'N/A'}
Phone: ${order.phoneNumber || 'N/A'}

ORDER DETAILS
------------------------------------------
${orderItems.map(item => 
`Product: ${item.name}
Category: ${item.category}
Price: $${item.price.toFixed(2)}
Quantity: ${item.quantity}
Item Total: $${item.total.toFixed(2)}
------------------------------------------`
).join('\n')}

PAYMENT SUMMARY
------------------------------------------
Subtotal: $${subtotal.toFixed(2)}
Shipping: Free
------------------------------------------
Total Amount: $${order.amount ? order.amount.toFixed(2) : '0.00'}

PAYMENT INFORMATION
------------------------------------------
Status: ${(order.status || 'PENDING').toUpperCase()}
Payment Method: M-PESA
Transaction ID: ${order.transactionId || 'Pending'}
Date Paid: ${order.status === 'completed' ? 
    new Date(order.updatedAt || Date.now()).toLocaleString() : 
    'Pending'}

==========================================
        Thank you for shopping!
==========================================`;

            // Create and trigger download with error handling
            try {
                const element = document.createElement('a');
                const file = new Blob([receiptContent], {type: 'text/plain'});
                const url = URL.createObjectURL(file);
                element.href = url;
                element.download = `receipt_${order.mpesaRequestId || Date.now()}.txt`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                URL.revokeObjectURL(url);
            } catch (downloadError) {
                throw new Error(`Failed to download receipt: ${downloadError.message}`);
            }

        } catch (error) {
            console.error('Receipt generation error:', error);
            alert(`Failed to generate receipt: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading orders...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="orders-admin">
            <div className="orders-header">
                <h2>Order Management</h2>
                <div className="orders-summary">
                    <div className="summary-box">
                        <h4>Total Orders</h4>
                        <p>{orders.length}</p>
                    </div>
                    <div className="summary-box">
                        <h4>Completed Orders</h4>
                        <p>{orders.filter(order => order.status === 'completed').length}</p>
                    </div>
                    <div className="summary-box">
                        <h4>Pending Payments</h4>
                        <p>{orders.filter(order => order.status === 'pending').length}</p>
                    </div>
                </div>
            </div>

            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order._id} className={`order-item ${order.status}`}>
                        <div className="order-header">
                            <h3>Order #{order.mpesaRequestId}</h3>
                            <span className={`status ${order.status}`}>
                                {order.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="order-details">
                            <div className="customer-info">
                                <h4>Customer Details</h4>
                                <p><strong>Name:</strong> {order.userName}</p>
                                <p><strong>Phone:</strong> {order.phoneNumber}</p>
                            </div>
                            <div className="payment-info">
                                <h4>Payment Details</h4>
                                <p><strong>Amount:</strong> ${order.amount.toFixed(2)}</p>
                                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                {order.transactionId && (
                                    <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                                )}
                            </div>
                        </div>
                        <div className="order-actions">
                            <button 
                                onClick={() => generateReceipt(order)}
                                className={`generate-receipt-btn ${order.status}`}
                                disabled={order.status !== 'completed'}
                            >
                                Generate Receipt
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;