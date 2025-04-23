import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Admin() {
    const navigate = useNavigate();
    const { user } = useAuth();

    

    useEffect(() => {

    });

    return (
        <div></div>
    )
}

export { Admin };