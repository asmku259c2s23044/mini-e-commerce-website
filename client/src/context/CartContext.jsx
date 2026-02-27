import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return {
                ...state,
                cartItems: action.payload || [],
            };
        case 'ADD_TO_CART': {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);

            let newCartItems;
            if (existItem) {
                newCartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                newCartItems = [...state.cartItems, item];
            }

            return {
                ...state,
                cartItems: newCartItems,
            };
        }
        case 'REMOVE_FROM_CART': {
            const newCartItems = state.cartItems.filter((x) => x._id !== action.payload);
            return {
                ...state,
                cartItems: newCartItems,
            };
        }
        case 'CLEAR_CART':
            return {
                ...state,
                cartItems: [],
            };
        case 'UPDATE_TOTALS': {
            const totalPrice = state.cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
            return {
                ...state,
                totalPrice: Number(totalPrice.toFixed(2)),
            };
        }
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const { userInfo } = useAuth();
    
    // Safety check for ID: Use guest if userInfo exists but ID is missing (old data)
    const cartKey = (userInfo && userInfo._id) ? `cartItems_${userInfo._id}` : 'cartItems_guest';

    const [state, dispatch] = useReducer(cartReducer, {
        cartItems: [],
        totalPrice: 0,
    });

    // Load cart when cartKey changes
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(cartKey);
            if (savedCart) {
                dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) });
            } else {
                dispatch({ type: 'SET_CART', payload: [] });
            }
        } catch (e) {
            console.error('Failed to load cart', e);
            dispatch({ type: 'SET_CART', payload: [] });
        }
    }, [cartKey]);

    // Save cart whenever items change
    useEffect(() => {
        if (state.cartItems) {
            localStorage.setItem(cartKey, JSON.stringify(state.cartItems));
            dispatch({ type: 'UPDATE_TOTALS' });
        }
    }, [state.cartItems, cartKey]);

    const addToCart = (product, quantity) => {
        if (!product || !product._id) return;
        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...product, quantity },
        });
    };

    const removeFromCart = (id) => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            payload: id,
        });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    }

    return (
        <CartContext.Provider value={{ ...state, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
