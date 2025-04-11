import React, { createContext, use, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addItem = (item) => {
        setCart((prevCart = []) => {
            const existing = prevCart.find((it) => it.id === item.id);
            if (existing) {
                return prevCart.map((it) => 
                    it.id === item.id ? { ...it, quantity: it.quantity + 1 } : it
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    }

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};