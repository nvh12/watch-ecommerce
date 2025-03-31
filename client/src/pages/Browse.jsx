import { useEffect, useState } from "react";
import Showcase from '../components/Showcase'

function Browse() {
    const [watches, setWatches] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [order, setOrder] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        fetch(`${apiUrl}/browse?${queryParams}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setWatches(data.data);
                    setTotalPages(data.totalPages);
                    setCurrentPage(data.page);
                    setOrder(data.order);
                    setStatus(data.status);
                }
            })
            .catch(error => console.error('Fetch failed:', error));
    }, []);

    return (
        <div>
            <Showcase
                title=''
                watches={watches} />
            <p className="text-gray-600 text-center">
                Page: currentPage / totalPages | Order: order
            </p>
        </div>
    );
}

export default Browse;