import React from 'react'
import "./Admin.css";
import Sidebar from '../Sidebar/Sidebar';
import AddProduct from '../AddProduct/AddProduct';
import ListProduct from '../ListProduct/ListProduct';
import { Routes,Route } from 'react-router-dom';
import Orders from '../Orders/Orders';
import Navbar from '../Navbar/Navbar';
const Admin = () => {
  return (
    <div className='admin'>
      <Navbar/>
      <Sidebar/>
      <Routes>
      <Route path="orders" element={<Orders />} />
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/listproduct' element={<ListProduct/>}/>
      </Routes>
    </div>
  );
}

export default Admin
