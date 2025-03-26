import React from 'react';
import { Outlet } from 'react-router-dom';
import "./Admin.css";
import Sidebar from '../../Components/Sidebar/Sidebar';

const Admin = () => {
    return (
        <div className='admin'>
            <Sidebar />
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    );
}

export default Admin;
