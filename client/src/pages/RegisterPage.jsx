import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login, userInfo } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const { data } = await axios.post(`${apiUrl}/users`, {
                name,
                email,
                password,
                role,
            });

            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join our store and start shopping</p>
                </div>

                {message && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl mb-6 text-sm">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">I want to register as:</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('customer')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                                    role === 'customer' 
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                    : 'bg-white border-gray-300 text-gray-600 hover:border-indigo-300'
                                }`}
                            >
                                <User size={18} />
                                <span className="font-medium text-sm">Customer</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                                    role === 'admin' 
                                    ? 'bg-purple-600 border-purple-600 text-white shadow-md' 
                                    : 'bg-white border-gray-300 text-gray-600 hover:border-purple-300'
                                }`}
                            >
                                <ShieldCheck size={18} />
                                <span className="font-medium text-sm">Admin</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:transform-none mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-gray-100">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
