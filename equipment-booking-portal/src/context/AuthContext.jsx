import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
export function AuthProvider({ children }) {

    // Check local storage to see if they logged in previously
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('portal_auth') === 'true';
    });

    // Auto-save login state to browser storage
    useEffect(() => {
        localStorage.setItem('portal_auth', isLoggedIn);
    }, [isLoggedIn]);

    // Simple login function for our mockup
    const login = (studentId, password) => {
        if (studentId && password) {
            setIsLoggedIn(true);
            return true;
        }
        return false;
    };

    // Logout function
    const logout = () => {
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
