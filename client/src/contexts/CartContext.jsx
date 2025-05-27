import React, { createContext, useContext, useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const loadCart = async () => {
            const savedCart = localStorage.getItem('cart');
            const parsedCart = JSON.parse(savedCart);
            if (savedCart) {
                for (const item of parsedCart) {
                    try {
                        const response = await fetch(`${apiUrl}/product/${item.product}`);
                        const result = await response.json();
                        if (result.status === 'success') {
                            const watch = result.watch;
                            item.price = watch.price * (1 - (watch.discount / 100));
                        }
                    } catch (error) {
                        console.error(`Failed to fetch product ${item.product}:`, error);
                    }
                }
                setCart(parsedCart);
            }
        };
        loadCart();
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

    const reduceItem = (item) => {
        setCart((prevCart = []) => {
            const existing = prevCart.find((it) => it.product === item.product);
            if (existing) {
                if (existing.quantity > 1) {
                    return prevCart.map((it) => {
                        return it.product === item.product ? { ...it, quantity: it.quantity - 1 } : it;
                    });
                } else {
                    return prevCart.filter((it) => it.product !== item.product);
                }
            }
            return prevCart;
        });
    };

    const removeItem = (item) => {
        setCart((prevCart) => prevCart.filter((it) => it.product !== item.product));
    }

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, setCart, addItem, reduceItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};