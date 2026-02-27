import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, Upload, ArrowLeft, Save, Edit } from 'lucide-react';

const EditProductPage = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    const { userInfo } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const { data } = await axios.get(`${apiUrl}/products/${id}`);
                setName(data.name);
                setPrice(data.price);
                setDescription(data.description);
                setCategory(data.category);
                setImage(data.image);
            } catch (error) {
                console.error('Error fetching product', error);
                alert('Could not load product details');
            } finally {
                setLoading(false);
            }
        };

        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/login');
        } else {
            fetchProduct();
        }
    }, [id, userInfo, navigate]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post(`${apiUrl}/products/upload`, formData, config);
            setImage(data.image);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Image upload failed');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.put(
                `${apiUrl}/products/${id}`,
                { name, price, description, category, image },
                config
            );

            navigate('/admin/products');
        } catch (error) {
            alert(error.response?.data?.message || 'Update failed');
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent animate-spin rounded-full"></div>
        </div>
    );

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
                    <Package size={120} className="text-emerald-900" />
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-10 flex items-center gap-3">
                    <Edit size={32} className="text-emerald-600" />
                    Edit Product
                </h1>

                <form onSubmit={submitHandler} className="space-y-8 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-black text-emerald-900 uppercase tracking-widest mb-3">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-emerald-50 rounded-2xl focus:border-emerald-500 focus:ring-0 outline-none transition-all font-bold"
                                placeholder="Enter product name"
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
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-emerald-900 uppercase tracking-widest mb-3">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-emerald-50 rounded-2xl focus:border-emerald-500 focus:ring-0 outline-none transition-all font-bold appearance-none"
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
                        <label className="block text-sm font-black text-emerald-900 uppercase tracking-widest mb-3">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-emerald-50 rounded-2xl focus:border-emerald-500 focus:ring-0 outline-none transition-all font-bold min-h-[150px]"
                            placeholder="Describe the traditional benefits..."
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
                                    placeholder="Image URL or upload below"
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
                                        {uploading ? 'Uploading...' : 'Upload New Photo'}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        <Save size={24} />
                        Update Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProductPage;
