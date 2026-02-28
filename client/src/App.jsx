import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddProductPage from './pages/AddProductPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import EditProductPage from './pages/EditProductPage';
import ProtectedRoute from './components/ProtectedRoute';
import { FavoritesProvider } from "./context/FavoritesContext";

function App() {
    const location = useLocation();
    const hideFooterRoutes = ['/login', '/register'];
    const showFooter = !hideFooterRoutes.includes(location.pathname);

    return (
        <FavoritesProvider>
            <div className="min-h-screen bg-[#f8faf0] flex flex-col font-sans text-gray-900 transition-colors duration-500">
                <Navbar />
                <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cart" element={
                        <ProtectedRoute>
                            <CartPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/checkout" element={
                        <ProtectedRoute>
                            <CheckoutPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="/orders" element={
                        <ProtectedRoute>
                            <OrdersPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/admin/add-product" element={
                        <ProtectedRoute adminOnly={true}>
                            <AddProductPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/products" element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminProductsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/orders" element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminOrdersPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/edit-product/:id" element={
                        <ProtectedRoute adminOnly={true}>
                            <EditProductPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>

                </main>

                {showFooter && (
                    <footer className="bg-white border-t border-gray-200 mt-auto shadow-inner">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 mb-8 border-b border-gray-100 pb-8 text-center md:text-left">
                            <div>
                                <h3 className="text-2xl font-black text-emerald-600 mb-4 font-serif italic tracking-tight">Mannvaasanai</h3>
                                <p className="text-gray-500 text-[14px] max-w-xs mx-auto md:mx-0 leading-relaxed font-medium">
                                    Experience the essence of tradition.<br />
                                    Bringing the natural goodness of our land to you.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-4 font-mono">Contact Info</h4>
                                <p className="text-sm text-gray-700 font-bold mb-1">Ph: 97513 21273</p>
                                <p className="text-xs text-emerald-600 font-bold mb-2 break-all italic">safrinbanukaburkhan@gmail.com</p>
                                <p className="text-[12px] text-gray-500 leading-tight font-medium">
                                    dr. 302/(4), Sammiyar street,<br />
                                    (Opp. Pillaiyarkovil Building),<br />
                                    Chokalingapuram, Melur, Madurai 625103
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center pt-4">
                            <p className="text-gray-400 text-[10px] text-center font-bold uppercase tracking-widest">
                                &copy; 2026 Mannvaasanai. Traditional Products.
                            </p>
                        </div>
                    </div>
                    </footer>
                )}
            </div>
        </FavoritesProvider>
    );
}

export default App;
