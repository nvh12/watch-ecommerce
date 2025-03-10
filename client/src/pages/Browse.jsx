import { useEffect, useState } from "react";

function Browse() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/browse')
            .then(response => response.text())
            .then(data => setMessage(data))
            .catch(error => console.error('Fetch failed:', error));
    }, []);

    return (
        <>Home: {message}</>
    );
}

export default Browse;