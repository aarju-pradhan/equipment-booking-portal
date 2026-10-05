import React, { createContext, useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('portal_token')));
    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem('portal_profile');
        return saved ? JSON.parse(saved) : {
            name: '',
            email: '',
            studentId: '',
            role: 'student'
        };
    });
    const [authReady, setAuthReady] = useState(!localStorage.getItem('portal_token'));

    const persistSession = (token, user) => {
        localStorage.setItem('portal_token', token);
        localStorage.setItem('portal_profile', JSON.stringify(user));
        setProfile(user);
        setIsLoggedIn(true);
    };

    const logout = useCallback(() => {
        localStorage.removeItem('portal_token');
        localStorage.removeItem('portal_profile');
        setIsLoggedIn(false);
        setProfile({ name: '', email: '', studentId: '', role: 'student' });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('portal_token');
        if (!token) {
            setAuthReady(true);
            return;
        }

        apiRequest('/auth/me')
            .then((data) => {
                localStorage.setItem('portal_profile', JSON.stringify(data.user));
                setProfile(data.user);
                setIsLoggedIn(true);
            })
            .catch(() => {
                logout();
            })
            .finally(() => setAuthReady(true));
    }, [logout]);

    const login = async (studentId, password) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ studentId, password })
        });
        persistSession(data.token, data.user);
        return data.user;
    };

    const register = async (form) => {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(form)
        });
        persistSession(data.token, data.user);
        return data.user;
    };

    const updateProfile = async (nextProfile) => {
        const data = await apiRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(nextProfile)
        });
        localStorage.setItem('portal_profile', JSON.stringify(data.user));
        setProfile(data.user);
        return data.user;
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            authReady,
            login,
            register,
            logout,
            profile,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}
