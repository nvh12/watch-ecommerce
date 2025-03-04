import { useState, useEffect } from 'react';

function Home() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000')
            .then(response => response.text())
            .then(data => setMessage(data))
            .catch(error => console.error('Fetch failed:', error));
    }, []);

    return (
        <div>Home: {message}</div>
    );
}

export default Home;