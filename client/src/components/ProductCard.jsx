import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingCart, Info, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({ product, refreshProducts }) => {
    const { addToCart } = useCart();
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);

    const handleAddToCart = () => {
        if (!userInfo) {
            navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
        }
        addToCart(product, 1);
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            setDeleting(true);
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                await axios.delete(`${apiUrl}/products/${product._id}`, config);
                if (refreshProducts) refreshProducts();
            } catch (error) {
                console.error('Delete failed', error);
                alert('Failed to delete product');
            } finally {
                setDeleting(false);
            }
        }
    };

    const getBaseUrl = () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        return apiUrl.replace('/api', '');
    };

    const imageUrl = (product?.image && typeof product.image === 'string' && product.image.startsWith('/'))
        ? `${getBaseUrl()}${product.image}`
        : (product?.image || '');

    // Check role from userInfo
    const isAdmin = userInfo && userInfo.role === 'admin';
    const isCustomer = !userInfo || userInfo.role === 'customer';

    return (
        <div className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border flex flex-col h-full group ${isAdmin ? 'border-purple-100 hover:border-purple-300' : 'border-gray-100 hover:border-indigo-200'
            }`}>
            <div className="h-56 overflow-hidden relative">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image'; }}
                />

                {/* Badge Overlay */}
                <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm border ${isAdmin
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-white/90 text-gray-700 border-gray-100 backdrop-blur-sm'
                        }`}>
                        {product.category}
                    </span>
                </div>

                {isAdmin && (
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className="p-6 flex-grow flex flex-col">
                <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                    </h3>
                </div>

                <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-grow leading-relaxed">
                    {product.description}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase font-semibold">Price</span>
                        <span className={`text-2xl font-black ${isAdmin ? 'text-purple-600' : 'text-indigo-600'}`}>
                            ₹{product.price.toLocaleString('en-IN')}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {isAdmin ? (
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-purple-400 uppercase">Management</span>
                                <div className="flex bg-purple-50 rounded-xl p-1 border border-purple-100">
                                    <button
                                        onClick={() => alert('Editing feature coming soon!')}
                                        className="p-2 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg transition-all"
                                        title="Edit Product"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                                        title="Delete Product"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center gap-2 active:scale-95"
                            >
                                <ShoppingCart size={18} />
                                <span>Add to Cart</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
