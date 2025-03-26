import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminAuth from './Components/Auth/AdminAuth';
import Admin from './Comp/Admin/Admin';


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
                </Route>
                <Route path="/" element={<Navigate to="/admin/auth" replace />} />
            </Routes>
        </div>
    );
}

export default App;
