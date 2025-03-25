import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../index.css';;

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://eccomercebackend-u1ce.onrender.com/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('admin-token', data.token);
                navigate('/admin/dashboard');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className="admin-login">
            <div className="admin-login-container">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;