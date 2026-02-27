import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        const saved = localStorage.getItem('userInfo');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Data Migration: handle old format if it still exists
                if (parsed.isAdmin !== undefined && !parsed.role) {
                    parsed.role = parsed.isAdmin ? 'admin' : 'customer';
                    localStorage.setItem('userInfo', JSON.stringify(parsed));
                }
                return parsed;
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    const login = (data) => {
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    };

    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
