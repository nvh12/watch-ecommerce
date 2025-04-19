import React, { createContext, useContext, useEffect, useState } from 'react';

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
            const existing = prevCart.find((it) => it.product === item.product);
            if (existing) {
                return prevCart.map((it) => 
                    it.product === item.product ? { ...it, quantity: it.quantity + 1 } : it
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item.product !== itemId));
    }

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, setCart, addItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};