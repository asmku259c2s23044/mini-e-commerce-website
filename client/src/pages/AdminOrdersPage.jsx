import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, User, Calendar, CreditCard, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userInfo || userInfo.role !== 'admin') {
                navigate('/login');
                return;
            }

            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                const { data } = await axios.get(`${apiUrl}/orders`, config);
                setOrders(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userInfo, navigate]);

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent animate-spin rounded-full"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#f8faf0]">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Order Management</h1>
                <p className="text-gray-500 font-medium">Monitor and manage all customer bookings.</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-center font-bold">{error}</div>}

            {orders.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-16 text-center">
                    <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">There are currently no customer bookings in the system.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-emerald-50 overflow-hidden hover:border-emerald-200 transition-colors">
                            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50">
                                <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-8">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-emerald-50 p-3 rounded-2xl">
                                            <User className="text-emerald-600" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Customer</p>
                                            <p className="font-bold text-gray-900">{order.user.name}</p>
                                            <p className="text-xs text-gray-500">{order.user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="bg-emerald-50 p-3 rounded-2xl md:hidden lg:flex">
                                            <Calendar className="text-emerald-600" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Date Placed</p>
                                            <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="bg-emerald-50 p-3 rounded-2xl md:hidden lg:flex">
                                            <CreditCard className="text-emerald-600" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Amount</p>
                                            <p className="font-black text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        {order.paymentStatus === 'Paid' ? (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/success?orderId=${order._id}`)}
                                        className="flex items-center gap-2 text-emerald-600 font-black text-sm hover:translate-x-1 transition-transform"
                                    >
                                        Details
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Items and Address Summary */}
                            <div className="px-8 py-6 bg-gray-50/30 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Order Items</p>
                                    <div className="flex flex-wrap gap-3">
                                        {order.orderItems.map((item, idx) => (
                                            <div key={idx} className="bg-white px-3 py-2 rounded-xl border border-gray-100 flex items-center gap-2 shadow-sm">
                                                <span className="text-xs font-black text-emerald-600 bg-emerald-50 w-5 h-5 flex items-center justify-center rounded-md">{item.quantity}</span>
                                                <span className="text-xs font-bold text-gray-700">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Delivery Address</p>
                                    <p className="text-sm font-bold text-gray-700">
                                        {order.user.address.line1}, {order.user.address.city}, {order.user.address.postal_code}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;
