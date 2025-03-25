import React from 'react';
import "./Admin.css";
import Sidebar from '../../Compenents/Sidebar/Sidebar';
import AddProduct from '../../Compenents/AddProduct/AddProduct';
import ListProduct from '../../Compenents/ListProduct/ListProduct';
import Orders from '../../Compenents/Orders/Orders';
import { Routes, Route, Navigate } from 'react-router-dom';

const Admin = () => {
  const isAuthenticated = localStorage.getItem('admin-token');

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className='admin'>
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route path="/dashboard" element={<Orders />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/listproduct" element={<ListProduct />} />
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
