import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useCart } from '../contexts/CartContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const { cart, clearCart } = useCart();

    const register = async (formData) => {
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (response.ok) {
            toast('Register successful!', { autoClose: 3000 });
        } else {
            throw new Error(result.message || 'Registration failed');
        }
    }

    const login = async (formData) => {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                ...formData,
                guestCart: cart
            })
        });
        const result = await response.json();
        if (response.ok) {
            setUser(result.curUser);
            clearCart();
            localStorage.removeItem('cart');
            toast('Login successful!', { autoClose: 3000 });
        } else {
            throw new Error(result.message || 'Login failed');
        }
    }

    const status = () => {
        fetch(`${apiUrl}/auth/status`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.authenticated) setUser(data.curUser);
                else setUser(null);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const refresh = async (retry = true) => {
        try {
            const response = await fetch(`${apiUrl}/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
            });
            const result = await response.json();
            if (response.ok && result.refreshed) return;
            if (!response.ok) {
                if (result.refreshed === false) {
                    logout();
                } else if (retry) {
                    console.warn('Refresh failed, will retry later');
                    setTimeout(() => refresh(false), 2000);
                }
                return;
            }
            if (!result.refreshed) {
                logout();
            }
        } catch (error) {
            console.warn('Refresh failed:', error.message);
        }
    }

    const logout = () => {
        setUser(null);
        clearCart();
        localStorage.removeItem('cart');
        fetch(`${apiUrl}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        toast('Logout successful!', { autoClose: 3000 });
    }

    useEffect(() => {
        status();
        const interval = setInterval(() => {
            refresh();
        }, 1000 * 60 * 10);
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            register,
            login,
            status,
            refresh,
            logout
        }} >
            {children}
        </AuthContext.Provider>
    );
};