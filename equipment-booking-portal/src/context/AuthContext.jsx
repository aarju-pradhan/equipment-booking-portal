import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const defaultProfile = {
    name: 'Demo Student',
    email: 'demo.student@cihe.edu.au',
    studentId: 's1234567'
};

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('portal_auth') === 'true';
    });

    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem('portal_profile');
        return saved ? JSON.parse(saved) : defaultProfile;
    });

    useEffect(() => {
        localStorage.setItem('portal_auth', isLoggedIn);
    }, [isLoggedIn]);

    useEffect(() => {
        localStorage.setItem('portal_profile', JSON.stringify(profile));
    }, [profile]);

    const login = (studentId, password) => {
        if (studentId && password) {
            setProfile((current) => ({
                ...current,
                studentId,
                email: current.email || `${studentId.toLowerCase()}@student.cihe.edu.au`
            }));
            setIsLoggedIn(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsLoggedIn(false);
    };

    const updateProfile = (nextProfile) => {
        setProfile(nextProfile);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, profile, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
