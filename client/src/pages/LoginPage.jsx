import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = new URLSearchParams(location.search).get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const { data } = await axios.post(`${apiUrl}/users/login`, { email, password });
            login(data);

            // Redirect based on query param or default logic
            if (redirect !== '/') {
                navigate(redirect);
            } else {
                navigate(data.role === 'admin' ? '/admin/products' : '/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-16 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Need an account? <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
