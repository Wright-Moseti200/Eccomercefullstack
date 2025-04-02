import React from 'react'
import "./Admin.css";
import Sidebar from '../Sidebar/Sidebar';
import AddProduct from '../AddProduct/AddProduct';
import ListProduct from '../ListProduct/ListProduct';
import Orders from '../Orders/Orders';
import { Routes,Route } from 'react-router-dom';

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
      <Routes>
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/listproduct' element={<ListProduct/>}/>
        <Route path='/orders' element={<Orders/>}/>
      </Routes>
    </div>
  );
}

export default Admin
