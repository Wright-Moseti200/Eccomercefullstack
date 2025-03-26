import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminAuth from './Components/Auth/AdminAuth';
import Admin from './Pages/Admin/Admin';
import Orders from './Components/Orders/Orders';
import AddProduct from './Comp/AddProduct/AddProduct';
import ListProduct from './Comp/ListProduct/ListProduct';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('admin-token');
    if (!isAuthenticated) {
        return <Navigate to="/admin/auth" replace />;
    }
    return children;
};

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/admin/auth" element={<AdminAuth />} />
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                }>
                    <Route index element={<Orders />} />
                    <Route path="dashboard" element={<Orders />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="addproduct" element={<AddProduct />} />
                    <Route path="listproduct" element={<ListProduct />} />
                </Route>
                <Route path="/" element={<Navigate to="/admin/auth" replace />} />
            </Routes>
        </div>
    );
}

export default App;
