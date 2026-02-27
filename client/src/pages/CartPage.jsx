import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cartItems, removeFromCart, addToCart, totalPrice } = useCart();

    const handleUpdateQuantity = (item, newQuantity) => {
        if (newQuantity > 0) {
            addToCart(item, newQuantity);
        } else {
            removeFromCart(item._id);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-xl font-medium text-gray-900">Your cart is empty</h2>
                    <p className="mt-2 text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {cartItems.map((item) => {
                                    const getBaseUrl = () => {
                                        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                                        return apiUrl.replace('/api', '');
                                    };

                                    const imageUrl = (item?.image && typeof item.image === 'string' && item.image.startsWith('/'))
                                        ? `${getBaseUrl()}${item.image}`
                                        : (item?.image || '');

                                    return (
                                        <li key={item._id} className="p-6 flex flex-col sm:flex-row gap-6">
                                            <img
                                                src={imageUrl}
                                                alt={item.name}
                                                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image'; }}
                                            />
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                                                            {item.name}
                                                        </h3>
                                                        <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                                                    </div>
                                                    <p className="text-lg font-medium text-indigo-600">₹{item.price.toLocaleString('en-IN')}</p>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center border border-gray-300 rounded-md">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                            className="px-3 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-l-md"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-4 py-1 font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                            className="px-3 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-r-md"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-xl font-medium text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 text-gray-600 mb-6 border-b border-gray-200 pb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold text-gray-900 mb-8">
                                <span>Total</span>
                                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
