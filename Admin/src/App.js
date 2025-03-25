import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Admin from './Pages/Admin/Admin';
import AdminLogin from './Components/Login/AdminLogin';
import ErrorBoundary from './Components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
