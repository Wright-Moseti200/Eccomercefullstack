import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext();

const getDefaultCart = () => {
    const cart = {};
    for (let i = 1; i < 300; i++) {
        cart[i] = 0;
    }
    return cart; // Added return statement that was missing
}

const ShopContentProvider = (props) => {
    const [all_product, setAll_product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        fetch('https://eccomercebackend-u1ce.onrender.com/allproducts')
            .then((response) => response.json())
            .then((data) => setAll_product(data))
            .catch((error) => console.error("Error fetching products:", error));

        if (localStorage.getItem('auth-token')) {
            fetch('https://eccomercebackend-u1ce.onrender.com/getcart', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}), // Empty object instead of empty string
            })
                .then((response) => response.json())
                .then((data) => setCartItems(data))
                .catch((error) => console.error("Error fetching cart:", error));
        }
    }, []);

    let addToCart = (itemId) => {
        setCartItems((currentItem) => {
            let setCurrentcart = { ...currentItem };
            setCurrentcart[itemId] += 1;
            return setCurrentcart;
        });

        if (localStorage.getItem('auth-token')) {
            fetch('https://eccomercebackend-u1ce.onrender.com/addtocart', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "item": itemId })
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error("Error adding to cart:", error));
        }
    };

    let removeFromCart = (itemId) => {
        setCartItems((currentItem) => {
            let setCurrentcart = { ...currentItem };
            setCurrentcart[itemId] -= 1;
            return setCurrentcart;
        });

        if (localStorage.getItem('auth-token')) {
            fetch('https://eccomercebackend-u1ce.onrender.com/removefromcart', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "item": itemId })
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error("Error removing from cart:", error));
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (let items in cartItems) {
            if (cartItems[items] > 0) {
                let product = all_product.find((e) => e.id === parseInt(items));
                if (product) {
                    totalAmount += product.new_price * cartItems[items];
                }
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    const handleCheckout = async () => {
        if (!localStorage.getItem('auth-token')) {
            alert('Please login to checkout');
            return;
        }
    
        try {
            const response = await fetch('https://eccomercebackend-u1ce.onrender.com/create-checkout-session', {
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
                throw new Error('Network response was not ok');
            }
    
            const { url } = await response.json();
            window.location.href = url; // Redirect to Stripe Checkout
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed. Please try again.');
        }
    };

    let contextValue = { all_product, getTotalCartItems, cartItems, addToCart, removeFromCart, getTotalCartAmount,handleCheckout };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContentProvider;