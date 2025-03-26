import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "./Sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleLogout = () => {
        localStorage.removeItem('admin-token');
        navigate('/admin/auth');
    };

    return (
        <div className='sidebar'>
            <Link to='/admin/dashboard' className={`sidebar-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                <span>Dashboard</span>
            </Link>
            <Link to='/admin/orders' className={`sidebar-item ${location.pathname === '/admin/orders' ? 'active' : ''}`}>
                <span>Orders</span>
            </Link>
            <Link to='/admin/addproduct' className={`sidebar-item ${location.pathname === '/admin/addproduct' ? 'active' : ''}`}>
                <span>Add Product</span>
            </Link>
            <Link to='/admin/listproduct' className={`sidebar-item ${location.pathname === '/admin/listproduct' ? 'active' : ''}`}>
                <span>List Products</span>
            </Link>
            <div className='sidebar-item' onClick={handleLogout}>
                <span>Logout</span>
            </div>
        </div>
    );
}

export default Sidebar;