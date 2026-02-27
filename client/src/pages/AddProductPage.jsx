import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, Package, ArrowLeft, PlusCircle } from 'lucide-react';

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const { data } = await axios.post(`${apiUrl}/products/upload`, formData, config);

            setImage(data.image);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setError('Image upload failed');
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.post(
                `${apiUrl}/products`,
                { name, price: Number(price), description, category, image },
                config
            );

            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo || userInfo.role !== 'admin') {
        navigate('/login');
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#f8faf0]">
            <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center gap-2 text-emerald-600 font-black mb-8 hover:-translate-x-1 transition-transform"
            >
                <ArrowLeft size={20} />
                Back to Inventory
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-emerald-100 p-8 md:p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <PlusCircle size={120} className="text-emerald-900" />
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-10 flex items-center gap-3">
                    <Package size={32} className="text-emerald-600" />
                    Add Traditional Product
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl mb-8 font-bold border border-red-100 flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-8 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-black text-emerald-900 uppercase tracking-widest mb-3">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-emerald-50 rounded-2xl focus:border-emerald-500 focus:ring-0 outline-none transition-all font-bold"
                                placeholder="e.g., Karuppu Kavuni Rice"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-black text-emerald-900 uppercase tracking-widest mb-3">Price (₹)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-emerald-50 rounded-2xl focus:border-emerald-500 focus:ring-0 outline-none transition-all font-bold"
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-emerald-900 uppercase tracking-widest mb-3">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-emerald-50 rounded-2xl focus:border-emerald-500 focus:ring-0 outline-none transition-all font-bold appearance-none cursor-pointer"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Millets">Millets</option>
                            <option value="Rice">Rice</option>
                            <option value="Oils">Oils</option>
                            <option value="Spices">Spices</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-emerald-900 uppercase tracking-widest mb-3">Health Benefits & Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-emerald-50 rounded-2xl focus:border-emerald-500 focus:ring-0 outline-none transition-all font-bold min-h-[150px]"
                            placeholder="Describe the traditional and nutritional benefits..."
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-emerald-900 uppercase tracking-widest mb-3">Product Image</label>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-full md:w-48 h-48 bg-gray-50 rounded-3xl border-2 border-dashed border-emerald-100 flex items-center justify-center overflow-hidden">
                                {image ? (
                                    <img src={image.startsWith('/') ? `http://localhost:5000${image}` : image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Package size={48} className="text-gray-200" />
                                )}
                            </div>
                            <div className="flex-1 w-full space-y-4">
                                <input
                                    type="text"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium"
                                    placeholder="Enter image URL or upload below"
                                />
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={uploadFileHandler}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black cursor-pointer hover:bg-emerald-100 transition-all border border-emerald-100"
                                    >
                                        <Upload size={20} />
                                        {uploading ? 'Processing Image...' : 'Upload High-Quality Photo'}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="h-6 w-6 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                        ) : (
                            <>
                                <PlusCircle size={24} />
                                Create Product
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductPage;
