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
                    setAll(data.all);
                }
            })
            .catch(error => console.error('Fetch failed:', error));
    }, []);

    return (
        <div className="container mx-auto px-4 sm:px-6">
            {[
                { title: 'Latest', watches: latest, link: '/browse?sortBy=createdAt&page=1&order=desc' },
                { title: 'Bestsellers', watches: bestseller, link: '/browse?sortBy=sold&page=1&order=desc' },
                { title: 'All Watches', watches: all, link: '/browse' }
            ].map((section, idx) => (
                <div className='my-16' key={idx}>
                    <h1 className='text-xl md:text-2xl font-semibold text-gray-800 mb-2 ml-2 sm:ml-4'>
                        {section.title}
                    </h1>
                    <Showcase watches={section.watches} />
                    <button
                        onClick={() => navigate(section.link)}
                        className="block mx-auto mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors shadow-sm"
                    >
                        See more
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Home;