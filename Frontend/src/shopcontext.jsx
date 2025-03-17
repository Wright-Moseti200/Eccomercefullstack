import React, { createContext,useState,useEffect } from "react";

export const ShopContext = createContext();

const getDefaultCart=()=>
    {
        const cart = {};
for (let i = 1; i < 300; i++) {
  cart[i] = 0;
}
    }

const ShopContentProvider = (props) => 
    {
     const [all_product,setAll_product]=useState([]);
    const [cartItems,setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
          .then((response) => response.json())
          .then((data) => setAll_product(data))
          .catch((error) => console.error("Error fetching products:", error));
      
        if (localStorage.getItem('auth-token')) {
          fetch('http://localhost:4000/getcart', {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'auth-token': `${localStorage.getItem('auth-token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}), // Empty object instead of empty string
          })
          .then((response) => response.json()) // Fixed: Added parentheses
          .then((data) => setCartItems(data))  // Fixed: Set to cartItems
          .catch((error) => console.error("Error fetching cart:", error));
        }
      }, []);
      
      let addToCart = (itemId) => {
        setCartItems((currentItem) => {
          let setCurrentcart = {...currentItem};
          setCurrentcart[itemId] += 1;
          return setCurrentcart;
        });
        
        if (localStorage.getItem('auth-token')) {
          fetch('http://localhost:4000/addtocart', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'auth-token': `${localStorage.getItem('auth-token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"item": itemId})  // Fixed: Changed itemId to item
          })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error("Error adding to cart:", error));
        }
      };
      
      let removeFromCart = (itemId) => {
        setCartItems((currentItem) => {
          let setCurrentcart = {...currentItem};
          setCurrentcart[itemId] -= 1;
          return setCurrentcart;
        });
        
        if (localStorage.getItem('auth-token')) {
          fetch('http://localhost:4000/removefromcart', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'auth-token': `${localStorage.getItem('auth-token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"item": itemId})  // Fixed: Changed itemId to item
          })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error("Error removing from cart:", error));
        }
      };
      

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(let items in cartItems) {
            if(cartItems[items] > 0) {
                let product = all_product.find((e) => e.id === parseInt(items));
                if(product) { 
                    totalAmount += product.new_price * cartItems[items];
                }
            }
        }
        return totalAmount;
    }


    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) 
            {
                if(cartItems[item]>0)
                {
                    totalItem+=cartItems[item];
                }
            }
            return totalItem;
    }

let contextValue = {all_product,getTotalCartItems,cartItems,addToCart,removeFromCart,getTotalCartAmount};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContentProvider;