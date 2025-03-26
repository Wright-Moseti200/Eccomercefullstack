import React, { useState } from 'react';
import "./AddProduct.css";

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        category: "women",
        new_price: "",
        old_price: ""
    });

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleInputChange = (e) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('product', image);

            // Upload image first
            const imageResponse = await fetch('https://eccomercebackend-u1ce.onrender.com/upload', {
                method: 'POST',
                body: formData
            });
            const imageData = await imageResponse.json();

            if (imageData.success) {
                // Then create product with image URL
                const productData = {
                    ...productDetails,
                    image: imageData.image_url
                };

                const response = await fetch('https://eccomercebackend-u1ce.onrender.com/addproduct', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('admin-token')
                    },
                    body: JSON.stringify(productData)
                });

                const data = await response.json();
                if (data.success) {
                    alert('Product added successfully');
                    setProductDetails({
                        name: "",
                        category: "women",
                        new_price: "",
                        old_price: ""
                    });
                    setImage(null);
                }
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };

    return (
        <div className="add-product">
            <h2>Add New Product</h2>
            <div className="form-group">
                <label>Product Name</label>
                <input
                    type="text"
                    name="name"
                    value={productDetails.name}
                    onChange={handleInputChange}
                    placeholder="Product name"
                />
            </div>
            <div className="form-group">
                <label>Category</label>
                <select 
                    name="category" 
                    value={productDetails.category}
                    onChange={handleInputChange}
                >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="form-group">
                <label>Old Price</label>
                <input
                    type="number"
                    name="old_price"
                    value={productDetails.old_price}
                    onChange={handleInputChange}
                    placeholder="Old price"
                />
            </div>
            <div className="form-group">
                <label>New Price</label>
                <input
                    type="number"
                    name="new_price"
                    value={productDetails.new_price}
                    onChange={handleInputChange}
                    placeholder="New price"
                />
            </div>
            <div className="form-group">
                <label>Product Image</label>
                <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                />
            </div>
            {image && (
                <div className="image-preview">
                    <img src={URL.createObjectURL(image)} alt="Preview" />
                </div>
            )}
            <button onClick={handleSubmit} className="add-button">
                Add Product
            </button>
        </div>
    );
};

export default AddProduct;