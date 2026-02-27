import React from 'react';

const AboutUsPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Welcome to <span className="text-emerald-600">Mannvaasanai</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                    Experience the essence of tradition and discover high-quality products.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-shadow flex flex-col h-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 inline-block border-emerald-500 self-start">
                        Our Story
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm flex-grow">
                        Mannvaasanai was founded on the principle of bringing authentic, traditional products to your doorstep. We believe in the fragrance of the soil and the richness it brings to our lives.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-shadow flex flex-col h-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 inline-block border-emerald-500 self-start">
                        Our Mission
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm flex-grow">
                        To empower local artisans and producers by providing them with a global platform, while ensuring our customers receive the most authentic and high-quality products.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-shadow flex flex-col h-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 inline-block border-emerald-500 self-start">
                        Our Values
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm flex-grow">
                        Integrity, authenticity, and community are at the core of everything we do. We strive to build lasting relationships with our partners and customers.
                    </p>
                </div>
            </div>

            <div className="mt-20 bg-emerald-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6">Experience the Essence of Tradition</h2>
                    <p className="text-emerald-100 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
                        We are more than just a store; we are a bridge between forgotten traditions and the natural goodness of our land.
                    </p>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-800 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-800 rounded-full opacity-50 blur-3xl"></div>
            </div>
        </div>
    );
};

export default AboutUsPage;
