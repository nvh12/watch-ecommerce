import { useState, useEffect } from 'react';
import Showcase from '../components/Showcase';

function Home() {
    const [latest, setLatest] = useState([]);
    const [bestseller, setBestseller] = useState([]);
    const [all, setAll] = useState([]);
    const [status, setStatus] = useState('');

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    useEffect(() => {
        fetch(apiUrl || 'http://localhost:5001')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setLatest(data.latest);
                    setBestseller(data.bestseller);
                    setAll(data.all)
                }
            })
            .catch(error => console.error('Fetch failed:', error));
    }, []);

    return (
        <div>
            <Showcase title='Latest' watches={latest} />
            <Showcase title='Bestsellers' watches={bestseller} />
            <Showcase title='All watches' watches={all} />
        </div>
    );
}

export default Home;