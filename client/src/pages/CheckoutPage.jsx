import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { MapPin, CreditCard, ShoppingBag } from 'lucide-react';

const CheckoutPage = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        line1: '',
        city: '',
        postal_code: '',
        country: 'India',
    });

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        if (!address.line1 || !address.city || !address.postal_code) {
            alert('Please fill in all address fields');
            return;
        }

        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            // 1. Create order on backend
            const { data: orderData } = await axios.post(`${apiUrl}/orders`, {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    product: item._id
                })),
                address, // Send the real address
                totalPrice
            }, config);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Mannvaasanai",
                description: "Traditional Products Purchase",
                order_id: orderData.razorpayOrderId,
                handler: async function (response) {
                    try {
                        // 2. Verify payment on backend
                        await axios.post(`${apiUrl}/orders/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderData.orderId
                        }, config);

                        clearCart();
                        navigate(`/success?orderId=${orderData.orderId}&redirect_status=succeeded`);
                    } catch (error) {
                        console.error("Verification failed", error);
                        alert("Payment verification failed! Please contact support.");
                    }
                },
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                },
                theme: {
                    color: "#059669", // emerald-600
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment initiation failed", error);
            alert("Could not initiate payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) {
        navigate('/login?redirect=checkout');
        return null;
    }

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/')}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
                >
                    Return to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#f8faf0]">
            <h1 className="text-3xl font-black text-gray-900 mb-10 flex items-center gap-3">
                <CreditCard className="text-emerald-600" />
                Secure Checkout
            </h1>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-3/5 space-y-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                            <MapPin size={24} className="text-emerald-600" />
                            Shipping Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Street Address</label>
                                <input
                                    type="text"
                                    name="line1"
                                    required
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                                    placeholder="House No, Street, Landmark"
                                    value={address.line1}
                                    onChange={handleAddressChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                                    value={address.city}
                                    onChange={handleAddressChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Postal Code</label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    required
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                                    value={address.postal_code}
                                    onChange={handleAddressChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Review Items</h2>
                        <ul className="divide-y divide-gray-100">
                            {cartItems.map((item) => {
                                const imageUrl = item.image.startsWith('/')
                                    ? `http://localhost:5000${item.image}`
                                    : item.image;

                                return (
                                    <li key={item._id} className="py-4 flex items-center">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 p-1">
                                            <img className="h-full w-full object-cover rounded-xl" src={imageUrl} alt={item.name} />
                                        </div>
                                        <div className="ml-6 flex-1">
                                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                                            <p className="text-gray-500 text-sm">₹{item.price.toLocaleString('en-IN')} × {item.quantity}</p>
                                        </div>
                                        <p className="font-black text-emerald-600">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                <div className="lg:w-2/5">
                    <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-8 sticky top-8">
                        <h2 className="text-2xl font-black text-gray-900 mb-8">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-bold">₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-emerald-600 font-bold uppercase text-xs tracking-widest">Free</span>
                            </div>
                            <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                <span className="text-3xl font-black text-emerald-600">₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="h-6 w-6 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                            ) : (
                                <>
                                    <CreditCard size={24} />
                                    Complete Purchase
                                </>
                            )}
                        </button>

                        <div className="mt-6 flex flex-col items-center gap-2">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-6 grayscale opacity-50" />
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] text-center">
                                100% Encrypted & Secure Payment
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
