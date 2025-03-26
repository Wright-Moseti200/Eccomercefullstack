/* eslint-disable no-unused-vars */
import React from 'react'
import "./Sidebar.css";
import {Link} from 'react-router-dom';
import add_product_icon from '../../Assets/Product_Cart.svg';
import list_product_icon from '../../Assets/Product_list_icon.svg';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to={'/addproduct'} style={{textDecoration:"none"}}>
        <div className='sidebar-item'>
            <img src={add_product_icon} alt="" className='sidebar-icon'/>
            <p>Add Product</p>
        </div>
      </Link>
      <Link to={'/listproduct'} style={{textDecoration:"none"}}>
        <div className='sidebar-item'>
            <img src={list_product_icon} alt="" className='sidebar-icon'/>
            <p>Product List</p>
        </div>
      </Link>
      <Link to={'/orders'} style={{textDecoration:"none"}}>
        <div className='sidebar-item'>
            <p>Orders</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar
