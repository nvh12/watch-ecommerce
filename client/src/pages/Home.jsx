import { useState, useEffect } from 'react';

function Home() {
    const [message, setMessage] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    useEffect(() => {
        fetch(apiUrl || 'http://localhost:5001')
            .then(response => response.text())
            .then(data => setMessage(data))
            .catch(error => console.error('Fetch failed:', error));
    }, []);

    return (
        <>Home: {message}</>
    );
}

export default Home;