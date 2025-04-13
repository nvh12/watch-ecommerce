import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
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
            alert(result.message);
        } else {
            throw new Error(result.message || 'Registration failed');
        }
    }

    const login = async (formData) => {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
    }

    const refresh = () => {
        fetch(`${apiUrl}/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (!data.refreshed) logout();
            })
            .catch(() => {
                logout();
            })
    }

    const logout = () => {
        setUser(null);
        clearCart();
        localStorage.removeItem('cart');
        fetch(`${apiUrl}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        })
    }

    useEffect(() => {
        status();
        const interval = setInterval(() => {
            refresh();
        }, 1000 * 60 * 5);
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
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