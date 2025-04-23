import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ImageGallery from '../components/ImageGallery';

function Product() {
    const { addItem } = useCart();
    const { user } = useAuth();
    const [watch, setWatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const { id } = useParams();

    const addProduct = async (id, price) => {
        if (user) {
            const response = await fetch(`${apiUrl}/cart/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    product: id,
                    price: price
                })
            });
            const result = await response.json();
            if (result.status !== 'success') {
                console.error('Add to cart failed:', result.message);
            }
        } else {
            addItem({ product: id, price: price });
        }
    }

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
            <div className='rounded-xl flex flex-col md:flex-row gap-10 bg-white shadow-md p-6 items-center'>
                <ImageGallery imageURLs={watch.image_url} name={watch.name} />
                <div className='flex flex-col gap-2'>
                    <h1 className='text-2xl font-semibold mb-3'>{watch.name}</h1>
                    <p className='font-medium'><span>Brand:</span> {watch.brand}</p>
                    <p className='font-medium'><span>Model:</span> {watch.model}</p>
                    <p className='font-medium'><span>Ref:</span> {watch.ref}</p>
                    <p className='font-medium'><span>Movement:</span> {watch.mvmt}</p>
                    <p className='font-medium'><span>Case Material:</span> {watch.casem}</p>
                    <p className='font-medium'><span>Bracelet Material:</span> {watch.bracem}</p>
                    <p className='font-medium'><span>Sex:</span> {watch.sex}</p>
                    <p className='text-2xl font-semibold text-green-600'>${watch.price}</p>
                    <button
                        onClick={() => addProduct(watch._id, watch.price)}
                        className='mt-4 w-full md:w-1/2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition'
                    >
                        Add to cart
                    </button>
                </div>
            </div>
            <div className='mt-8 bg-white shadow-md rounded-xl p-6'>
                <h2 className='text-xl font-semibold mb-2'>Description</h2>
                <p>{watch.description}</p>
            </div>
        </div>
    )
}

export default Product;