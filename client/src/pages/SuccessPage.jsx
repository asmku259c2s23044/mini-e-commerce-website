import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SuccessPage = () => {
    const [searchParams] = useSearchParams();
    const redirectStatus = searchParams.get('redirect_status');
    const orderId = searchParams.get('orderId');

    const { clearCart } = useCart();
    const { userInfo } = useAuth();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Clear cart on success
        if (redirectStatus === 'succeeded' || orderId) {
            clearCart();
        }
    }, [redirectStatus, orderId, clearCart]);

    useEffect(() => {
        const fetchOrder = async () => {
            if (orderId && userInfo) {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    const config = {
                        headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                    };
                    const { data } = await axios.get(`${apiUrl}/orders/${orderId}`, config);
                    setOrderDetails(data);
                } catch (error) {
                    console.error("Failed to fetch order details", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, userInfo]);

    // Show success if redirectStatus is 'succeeded' OR if we have a valid orderId
    const isSuccess = redirectStatus === 'succeeded' || orderId;

    if (loading) {
        return (
            <div className="min-h-[70vh] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!isSuccess) {
        return (
            <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 bg-[#f8faf0]">
                <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-red-50 text-center max-w-md">
                    <AlertCircle className="w-20 h-20 text-red-500 mb-6 mx-auto" />
                    <h1 className="text-3xl font-black text-gray-900 mb-4">Payment Failed</h1>
                    <p className="text-lg text-gray-600 mb-8 font-medium">
                        We couldn't process your payment. Please try again or use a different payment method.
                    </p>
                    <Link
                        to="/checkout"
                        className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-emerald-600 text-white text-lg font-black rounded-2xl shadow-lg hover:bg-emerald-700 transition-all active:scale-[0.98]"
                    >
                        Return to Checkout
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[71vh] flex flex-col items-center justify-center py-16 px-4 bg-[#f8faf0]">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-emerald-50 max-w-2xl w-full text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <ShoppingBag size={120} className="text-emerald-900" />
                </div>

                <div className="relative z-10">
                    <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Order Confirmed!</h1>
                    <p className="text-lg text-gray-600 mb-10 font-medium">
                        Thank you for your purchase. We've received your order and are currently processing the natural goodness for you.
                    </p>

                    {orderDetails && (
                        <div className="bg-emerald-50/50 rounded-3xl p-8 mb-10 text-left border border-emerald-100">
                            <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest mb-6 border-b border-emerald-200 pb-3">Order Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-emerald-800 font-bold">Order Reference:</span>
                                    <span className="font-mono text-xs bg-white px-3 py-1 rounded-full border border-emerald-100">{orderId}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-emerald-800 font-bold">Total Amount paid:</span>
                                    <span className="text-2xl font-black text-emerald-700">₹{orderDetails.totalPrice.toLocaleString('en-IN')}</span>
                                </div>

                                <div className="flex justify-between items-center text-sm border-t border-emerald-100 pt-4">
                                    <span className="text-emerald-800 font-bold">Items Count:</span>
                                    <span className="font-black text-emerald-900">{orderDetails.orderItems.length} items</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/"
                            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white text-lg font-black rounded-2xl shadow-lg hover:bg-emerald-700 transition-all active:scale-[0.98]"
                        >
                            <ShoppingBag size={20} />
                            Continue Shopping
                        </Link>
                        <Link
                            to="/orders"
                            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 text-lg font-black rounded-2xl border-2 border-emerald-100 hover:bg-emerald-50 transition-all active:scale-[0.98]"
                        >
                            View My Orders
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
