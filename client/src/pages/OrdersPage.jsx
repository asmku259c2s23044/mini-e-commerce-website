import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userInfo) return;

            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                const { data } = await axios.get(`${apiUrl}/orders/myorders`, config);
                setOrders(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userInfo]);

    if (!userInfo) {
        navigate('/login?redirect=orders');
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#f8faf0]">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 mb-2">My Orders</h1>
                <p className="text-gray-500 font-medium">Track and manage your traditional treasures.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent animate-spin rounded-full"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 text-center">
                    {error}
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-16 text-center">
                    <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't discovered our traditional products yet. Start your journey today!</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
                    >
                        Explore Products
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-emerald-50 overflow-hidden hover:border-emerald-200 transition-colors">
                            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-50 p-3 rounded-2xl">
                                        <Package className="text-emerald-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Order ID</p>
                                        <p className="font-bold text-gray-900">#{order._id.substring(0, 10).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 text-sm">
                                    <div>
                                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Date</p>
                                        <p className="font-bold text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Total</p>
                                        <p className="font-black text-emerald-600 text-lg">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {order.paymentStatus === 'Paid' ? (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                                                <CheckCircle size={12} />
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                                                <Clock size={12} />
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/success?orderId=${order._id}`)}
                                    className="flex items-center gap-2 text-emerald-600 font-black text-sm hover:translate-x-1 transition-transform"
                                >
                                    View Details
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                            <div className="px-6 py-4 bg-gray-50/50 flex gap-4 overflow-x-auto">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex-shrink-0 flex items-center gap-3">
                                        <div className="bg-white p-1 rounded-lg border border-gray-100">
                                            <div className="h-10 w-10 bg-emerald-50 rounded-md flex items-center justify-center text-xs font-bold text-emerald-600">
                                                {item.quantity}x
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-600 whitespace-nowrap">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
