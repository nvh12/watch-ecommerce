import { useState, useEffect } from 'react';
import Showcase from '../components/Showcase';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [latest, setLatest] = useState([]);
    const [bestseller, setBestseller] = useState([]);
    const [all, setAll] = useState([]);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    useEffect(() => {
        fetch(apiUrl)
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
        <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-12">
                <h1 className="text-2xl md:text-3xl font-bold mt-12 ml-6">Latest</h1>
                <Showcase watches={latest} />
                <button
                    onClick={() => navigate('/browse?sortBy=createdAt&page=1&order=desc')}
                    className="block mx-auto mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    See more
                </button>
            </div>
            <div className="mb-12">
                <h1 className="text-2xl md:text-3xl font-bold mt-12 ml-6">Bestsellers</h1>
                <Showcase watches={bestseller} />
                <button
                    onClick={() => navigate('/browse?sortBy=sold&page=1&order=desc')}
                    className="block mx-auto mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    See more
                </button>
            </div>
            <div className="mb-12">
                <h1 className="text-2xl md:text-3xl font-bold mt-12 ml-6">All Watches</h1>
                <Showcase watches={all} />
                <button
                    onClick={() => navigate('/browse')}
                    className="block mx-auto mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    See more
                </button>
            </div>
        </div>
    );
}

export default Home;