import React, { useState, useEffect } from 'react';
import './ListProduct.css';

const ListProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:4000/allproducts');
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`http://localhost:4000/removeproduct`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('admin-token')
                    },
                    body: JSON.stringify({ id: productId })
                });

                const data = await response.json();
                if (data.success) {
                    alert('Product deleted successfully');
                    fetchProducts(); // Refresh the list
                } else {
                    alert('Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product');
            }
        }
    };

    if (loading) {
        return <div>Loading products...</div>;
    }

    return (
        <div className="list-product">
            <h2>All Products</h2>
            <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="product-image"
                        />
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p>Category: {product.category}</p>
                            <p>New Price: ${product.new_price}</p>
                            <p>Old Price: ${product.old_price}</p>
                        </div>
                        <button 
                            onClick={() => handleDelete(product.id)}
                            className="delete-btn"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListProduct;