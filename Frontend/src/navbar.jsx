/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
import React, { useState,useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import "./index.css";

import logobig from "./Assets/logo_big.png";
import cartimage from "./Assets/cart_icon.png";
import { ShopContext } from "./shopcontext";
const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
const [cartvalue, setCartValue] = useState(0);
  const handleClick = (index) => {
    setActiveIndex(index);
  };
const { getTotalCartItems } = useContext(ShopContext);

  const getLinkStyle = (index) => {
    return {
      color: activeIndex === index ? "#FFA500" : "#000000",
      transition: "color 0.3s ease",
    };
  };

  return (
    <>
      <div className="flex justify-around flex-row w-full items-center h-20">
        <div className="flex items-center justify-between w-52">
          <img src={logobig} alt="logo image" className="h-14 " />
          <h1 className="font-semibold text-3xl">SHOPPER</h1>
        </div>
        <div className="flex w-80 items-center justify-around">
          <p>
            <Link to="/" style={getLinkStyle(0)} onClick={() => handleClick(0)}>
              Shop
            </Link>
          </p>
          <p>
            <Link
              to="/men"
              style={getLinkStyle(1)}
              onClick={() => handleClick(1)}
            >
              Men
            </Link>
          </p>
          <p>
            <Link
              to="/women"
              style={getLinkStyle(2)}
              onClick={() => handleClick(2)}
            >
              Women
            </Link>
          </p>
          <p>
            <Link
              to="/kids"
              style={getLinkStyle(3)}
              onClick={() => handleClick(3)}
            >
              Kids
            </Link>
          </p>
        </div>
        <div className="flex w-48 justify-around">
        {localStorage.getItem('auth-token')?
        <button className="btn-transparent border-1 border-black w-24 rounded-full" onClick={()=>{localStorage.removeItem('auth-token');
        window.location.replace('/');
        }}>Logout</button>:
          <button className="btn-transparent border-1 border-black w-24 rounded-full">
            <Link to="/login">Login</Link>
          </button>
        }
          <Link to="/cart" className="flex">
            <img src={cartimage} alt="cartimage" className="h-10" />
            <div className="bg-orange-500 text-white h-5 w-5 rounded-full text-center flex justify-center items-center mr-10">{getTotalCartItems()}</div>
          </Link>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navbar;
