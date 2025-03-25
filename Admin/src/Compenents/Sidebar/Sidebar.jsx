/* eslint-disable no-unused-vars */
import React from 'react'
import "./Sidebar.css";
import { Link, useNavigate } from 'react-router-dom';
import add_product_icon from '../../Assets/Product_Cart.svg';
import list_product_icon from '../../Assets/Product_list_icon.svg';
import dashboard_icon from '../../Assets/dashboard_icon.svg';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    navigate('/admin/login');
  };

  return (
    <div className='sidebar'>
      <Link to='/admin/dashboard' style={{textDecoration:"none"}}>
        <div className='sidebar-item'>
          <img src={dashboard_icon} alt="" className='sidebar-icon'/>
          <p>Dashboard</p>
        </div>
      </Link>
      <Link to='/admin/addproduct' style={{textDecoration:"none"}}>
        <div className='sidebar-item'>
          <img src={add_product_icon} alt="" className='sidebar-icon'/>
          <p>Add Product</p>
        </div>
      </Link>
      <Link to='/admin/listproduct' style={{textDecoration:"none"}}>
        <div className='sidebar-item'>
          <img src={list_product_icon} alt="" className='sidebar-icon'/>
          <p>Product List</p>
        </div>
      </Link>
      <div className='sidebar-item' onClick={handleLogout}>
        <p>Logout</p>
      </div>
    </div>
  );
}

export default Sidebar;
