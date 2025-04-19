import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import ImageGallery from '../components/ImageGallery';

function Product() {
    const { addItem } = useCart();
    const [watch, setWatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const { id } = useParams();

    useEffect(() => {
        fetch(`${apiUrl}/product/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setWatch(data.watch);
                }
            })
            .catch(error => console.error('Fetch failed:', error))
            .finally(() => setLoading(false));
    }, [id]);
    if (loading) {
        return <div className='text-center py-10 text-xl'>Loading...</div>;
    }
    if (!watch) {
        return <div className='text-center py-10 text-red-500'>Watch not found.</div>;
    }
    return (
        <div className='max-w-5xl mx-auto p-6'>
            <div className='flex flex-col md:flex-row gap-10 bg-white shadow-md p-6 items-center'>
                <ImageGallery imageURLs={watch.image_url} name={watch.name} />
                <div className='flex flex-col gap-2'>
                    <h1 className='text-2xl font-semibold'>{watch.name}</h1>
                    <p><span className='font-medium'>Brand:</span> {watch.brand}</p>
                    <p><span className='font-medium'>Model:</span> {watch.model}</p>
                    <p><span className='font-medium'>Ref:</span> {watch.ref}</p>
                    <p><span className='font-medium'>Movement:</span> {watch.mvmt}</p>
                    <p><span className='font-medium'>Case Material:</span> {watch.casem}</p>
                    <p><span className='font-medium'>Bracelet Material:</span> {watch.bracem}</p>
                    <p><span className='font-medium'>Sex:</span> {watch.sex}</p>
                    <button
                        onClick={() => addItem({ product: watch._id, price: watch.price})}
                        className='mt-4 w-full md:w-1/2 bg-red-700 text-white py-2 rounded-xl hover:bg-red-500 transition'
                    >
                        Add to cart
                    </button>
                </div>
            </div>
            <div className='mt-8 bg-white shadow-md rounded-2xl p-6'>
                <h2 className='text-xl font-semibold mb-2'>Description</h2>
                <p>{watch.description}</p>
            </div>
        </div>
    )
}

export default Product;