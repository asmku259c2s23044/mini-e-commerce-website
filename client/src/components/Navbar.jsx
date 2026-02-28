import React from "react";
import {
  ShoppingCart,
  User,
  LogOut,
  PlusSquare,
  Home,
  Package,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();
  const { favoriteItems } = useFavorites();
  const navigate = useNavigate();

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 relative">
          {/* Left Side */}
          {(!userInfo || userInfo.role !== "admin") && (
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="p-2 text-emerald-900 hover:text-emerald-600 transition-colors rounded-full hover:bg-emerald-50"
              >
                <Home size={22} />
              </Link>
            </div>
          )}

          {/* Center Logo + Name */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
            <Link
              to={userInfo?.role === "admin" ? "/admin/products" : "/"}
              className="flex items-center space-x-2"
            >
              {/* Logo Image */}
              <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />

              {/* Brand Name */}
              <span className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700 font-serif italic tracking-tight">
                Mannvaasanai
              </span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex-grow flex items-center justify-end space-x-2 md:space-x-4">
            {userInfo && userInfo.role === "admin" ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin/products"
                  className="flex items-center text-sm font-bold text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-100"
                >
                  <Package size={18} />
                </Link>
                <Link
                  to="/admin/orders"
                  className="flex items-center text-sm font-bold text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-100"
                >
                  <ShoppingBag size={18} />
                </Link>
                <Link
                  to="/admin/add-product"
                  className="flex items-center text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100"
                >
                  <PlusSquare size={18} />
                </Link>
              </div>
            ) : (
              <>
                {/* ❤️ Favorites */}
                <Link
                  to="/favorites"
                  className="relative p-2 text-emerald-900 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                >
                  <Heart size={24} />
                  {favoriteItems.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-black text-white bg-red-500 rounded-full">
                      {favoriteItems.length}
                    </span>
                  )}
                </Link>

                {/* 🛒 Cart */}
                <Link
                  to="/cart"
                  className="relative p-2 text-emerald-900 hover:text-emerald-600 transition-colors"
                >
                  <ShoppingCart size={24} />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-black text-white bg-red-500 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Auth */}
            {userInfo ? (
              <button
                onClick={logoutHandler}
                className="p-2 text-emerald-900 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
              >
                <LogOut size={22} />
              </button>
            ) : (
              <Link
                to="/login"
                className="p-2 text-emerald-900 hover:text-emerald-600 transition-colors rounded-full hover:bg-emerald-50"
              >
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
