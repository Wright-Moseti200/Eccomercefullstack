import React from 'react'
import Navbar from './Compenents/Navbar/navbar';
import Admin from './Pages/Admin/Admin';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './Compenents/Login/AdminLogin';
import ProtectedAdminRoute from './Compenents/ProtectedRoute';
import Dashboard from './Components/Dashboard/Dashboard';

const App = () => {
  return (
    <div>
      <Navbar/>
      <Admin/>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <ProtectedAdminRoute>
            <Dashboard />
          </ProtectedAdminRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
