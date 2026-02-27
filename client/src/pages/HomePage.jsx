import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Leaf, Wheat, Sprout } from 'lucide-react';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('Millets');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const { data } = await axios.get(`${apiUrl}/products`);

            if (!Array.isArray(data)) {
                throw new Error('Expected an array of products');
            }

            setProducts(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        setFilteredProducts(products.filter(p => p.category === category));
    }, [category, products]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 text-xl font-semibold">Error: {error}</p>
                <button
                    onClick={fetchProducts}
                    className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section with Gradient Background */}
            <div className="relative rounded-[3rem] overflow-hidden mb-16 shadow-2xl border-4 border-white group bg-gradient-to-br from-emerald-100 via-white to-teal-50">
                <div className="relative z-10 text-center py-20 px-6 space-y-6">
                    <p className="text-sm md:text-2xl font-black text-emerald-900 leading-tight italic drop-shadow-sm font-serif max-w-2xl mx-auto">
                        “நமது நாட்டு பாரம்பரிய அரிசி வகைகள் – ஆரோக்கியமும் இயற்கையும் ஒன்றாக.”
                    </p>
                    <div className="flex justify-center">
                        <span className="inline-block px-8 py-3 bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.25em] rounded-full shadow-lg border-2 border-white/50">
                            100% Organic & Traditional
                        </span>
                    </div>
                </div>
            </div>

            {/* Category Filter - Only Millets and Rice */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
                <button
                    onClick={() => setCategory('Millets')}
                    className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black transition-all shadow-sm transform active:scale-95 border-2 ${category === 'Millets'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-200 shadow-xl'
                        : 'bg-white text-gray-500 border-gray-100 hover:border-emerald-200 hover:bg-emerald-50'
                        }`}
                >
                    <Wheat size={24} />
                    <span>ORGANC MILLETS</span>
                </button>
                <button
                    onClick={() => setCategory('Rice')}
                    className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black transition-all shadow-sm transform active:scale-95 border-2 ${category === 'Rice'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-200 shadow-xl'
                        : 'bg-white text-gray-500 border-gray-100 hover:border-emerald-200 hover:bg-emerald-50'
                        }`}
                >
                    <Sprout size={24} />
                    <span>TRADITIONAL RICE</span>
                </button>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-emerald-200">
                    <Leaf size={48} className="mx-auto text-emerald-300 mb-4" />
                    <p className="text-emerald-900/60 font-bold">Selection coming soon...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="h-full transform hover:-translate-y-1 transition-transform duration-300">
                            <ProductCard
                                product={product}
                                refreshProducts={fetchProducts}
                            />
                        </div>
                    ))}
                </div>
            )}


        </div>
    );
};

export default HomePage;
