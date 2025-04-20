import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

function Checkout() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate('auth/login');
    })

    return (
        <div></div>
    )
}

export default Checkout;