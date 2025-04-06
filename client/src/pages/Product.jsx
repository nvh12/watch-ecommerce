import { useState, useEffect } from 'react';

function Product({ id }) {
    const [watch, setWatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    useEffect(() => {
        fetch(`${apiUrl}/product/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setWatch(data);
                }
            })
            .catch(error => console.error('Fetch failed:', error))
            .finally(() => setLoading(false));
        }, []);
        if (loading) {
            return <div className="text-center py-10 text-xl">Loading...</div>;
        }
    
        if (!watch) {
            return <div className="text-center py-10 text-red-500">Watch not found.</div>;
        }
    return (
        <div className='flex flex-col'>
            <div className='flex flex-row'>
                <div>
                    <img src={watch.image_url[0]} alt={watch.name} />
                </div>
                <div>
                    <h1>{watch.name}</h1>
                    <p>Brand: {watch.brand}</p>
                    <p>Model: {watch.model}</p>
                    <p>Ref: {watch.ref}</p>
                    <p>Movement: {watch.mvmt}</p>
                    <p>Case material: {watch.casem} </p>
                    <p>Brace material: {watch.bracem}</p>
                    <p>Sex: {watch.sex}</p>
                </div>
            </div>
            <div>
                <h1>Description</h1>
                <p>{watch.description}</p>
            </div>
        </div>
    )
}

export default Product;