import { useEffect, useState } from "react";

function Browse() {
    const [watches, setWatches] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [order, setOrder] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        fetch(`${apiUrl}/browse`)
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
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Browse Watches</h1>
            <p className="text-gray-600 text-center">Status: {status}</p>
            <p className="text-gray-600 text-center">
                Page: {currentPage} / {totalPages} | Order: {order}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
                {watches.map((watch) => (
                    <div key={watch._id} className="border p-4 shadow-lg rounded-lg text-center">
                        <img src={watch.image_url[0]} alt={watch.name} className="w-full h-48 object-cover rounded-md" />
                        <h3 className="text-xl font-semibold mt-2">{watch.name}</h3>
                        <p className="text-gray-500">Brand: {watch.brand}</p>
                        <p className="text-green-600 font-bold">Price: ${watch.price.$numberDecimal}</p>
                        <p className={`mt-2 ${watch.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                            {watch.stock > 0 ? `In Stock: ${watch.stock}` : "Out of Stock"}
                        </p>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600">
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Browse;