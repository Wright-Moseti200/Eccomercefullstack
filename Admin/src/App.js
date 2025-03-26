import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminAuth from './Components/Auth/AdminAuth';
import Admin from './Comp/Admin/Admin.jsx'
import Orders from './Components/Orders/Orders.jsx';
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('admin-token');
    if (!isAuthenticated) {
        return <Navigate to="/admin/auth" replace />;
    }
    return children;
};

function App() {
    return (
        <Routes>
            <Route path="/admin/auth" element={<AdminAuth />} />
            <Route path="/admin/*" element={
                <ProtectedRoute>
                    <Admin />
                </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/admin/auth" replace />} />
            <Route path="dashboard" element={<Orders />} />
            <Route path="orders" element={<Orders />} />
        </Routes>
    );
}

export default App;
