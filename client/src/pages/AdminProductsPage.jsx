import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash2, Plus, Package, ShoppingBag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const { data } = await axios.get(`${apiUrl}/products`);
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchProducts();
    }, [userInfo, navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await axios.delete(`${apiUrl}/products/${id}`, config);
                fetchProducts();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent animate-spin rounded-full"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#f8faf0]">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Inventory Management</h1>
                    <p className="text-gray-500 font-medium">Manage your traditional products repository.</p>
                </div>
                <Link
                    to="/admin/add-product"
                    className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
                >
                    <Plus size={20} />
                    Add Product
                </Link>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-center font-bold">{error}</div>}

            <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-emerald-50/50">
                            <th className="px-6 py-4 text-xs font-black text-emerald-700 uppercase tracking-widest">Product</th>
                            <th className="px-6 py-4 text-xs font-black text-emerald-700 uppercase tracking-widest">Category</th>
                            <th className="px-6 py-4 text-xs font-black text-emerald-700 uppercase tracking-widest">Price</th>
                            <th className="px-6 py-4 text-xs font-black text-emerald-700 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl overflow-hidden border border-gray-100 p-1 flex-shrink-0">
                                            <img
                                                src={product.image.startsWith('/') ? `http://localhost:5000${product.image}` : product.image}
                                                alt={product.name}
                                                className="h-full w-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <span className="font-bold text-gray-900 truncate max-w-[200px]">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-black text-gray-900">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => deleteHandler(product._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="py-20 text-center">
                        <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-500 font-bold">No products found in inventory.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProductsPage;
