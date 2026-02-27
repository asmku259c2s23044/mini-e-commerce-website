import React from 'react';
import { ShoppingCart, User, LogOut, PlusSquare, Home, Package, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { cartItems } = useCart();
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();

    const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const logoutHandler = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16 relative">
                    {/* Left corner: Nav Icons (Hide for admin) */}
                    {(!userInfo || userInfo.role !== 'admin') && (
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="p-2 text-emerald-900 hover:text-emerald-600 transition-colors rounded-full hover:bg-emerald-50" title="Home">
                                <Home size={22} />
                            </Link>
                        </div>
                    )}

                    {/* Center: Brand Title */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center pointer-events-none">
                        <Link to={userInfo?.role === 'admin' ? '/admin/products' : '/'} className="pointer-events-auto">
                            <span className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 transition-all font-serif italic tracking-tight">
                                Mannvaasanai
                            </span>
                        </Link>
                    </div>

                    {/* Right corner: Auth/Cart/Admin */}
                    <div className="flex-grow flex items-center justify-end space-x-2 md:space-x-4">
                        {/* Admin specific links */}
                        {userInfo && userInfo.role === 'admin' ? (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/admin/products"
                                    className="flex items-center text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all px-3 py-1.5 rounded-xl border border-gray-100"
                                >
                                    <Package size={18} />
                                    <span className="hidden lg:inline ml-1.5">Products</span>
                                </Link>
                                <Link
                                    to="/admin/orders"
                                    className="flex items-center text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all px-3 py-1.5 rounded-xl border border-gray-100"
                                >
                                    <ShoppingBag size={18} />
                                    <span className="hidden lg:inline ml-1.5">Orders</span>
                                </Link>
                                <Link
                                    to="/admin/add-product"
                                    className="flex items-center text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-all bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100"
                                >
                                    <PlusSquare size={18} />
                                    <span className="hidden lg:inline ml-1.5">Add Product</span>
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Cart (User only) */}
                                <Link to="/cart" className="relative p-2 text-emerald-900 hover:text-emerald-600 transition-colors">
                                    <ShoppingCart size={24} />
                                    {cartItemCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-black leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full shadow-sm">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}

                        {/* Auth */}
                        {userInfo ? (
                            <div className="flex items-center space-x-2 border-l border-gray-200 pl-4 ml-2">
                                <div className="hidden md:block text-right mr-2">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{userInfo.role}</p>
                                    <p className="text-xs font-bold text-gray-900 truncate max-w-[100px]">{userInfo.name}</p>
                                </div>
                                {userInfo.role !== 'admin' && (
                                    <Link to="/orders" className="p-2 text-emerald-900 hover:text-emerald-600 transition-colors rounded-full hover:bg-emerald-50" title="My Orders">
                                        <Package size={22} />
                                    </Link>
                                )}
                                <button
                                    onClick={logoutHandler}
                                    className="p-2 text-emerald-900 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                                    title="Logout"
                                >
                                    <LogOut size={22} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="p-2 text-emerald-900 hover:text-emerald-600 transition-colors rounded-full hover:bg-emerald-50" title="Login">
                                <User size={24} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
