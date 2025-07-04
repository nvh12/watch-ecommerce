import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ImageGallery from '../components/ImageGallery';
import Showcase from '../components/Showcase';

function Product() {
    const { addItem } = useCart();
    const { user } = useAuth();
    const [watch, setWatch] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
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
                toast('Failed to add to cart', { autoClose: 3000 });
            } else {
                toast('Added to cart', { autoClose: 3000 });
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
            .catch(() => toast('Failed to load', { autoClose: 3000 }))
            .finally(() => setLoading(false));
        fetch(`${apiUrl}/product/${id}/recommendations`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setRecommendations(data.recommendations);
                }
            })
            .catch(error => console.error('Fetch failed:', error))
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
                    <p className='font-medium'><span className='font-semibold'>Brand:</span> {watch.brand}</p>
                    <p className='font-medium'><span className='font-semibold'>Model:</span> {watch.model}</p>
                    <p className='font-medium'><span className='font-semibold'>Ref:</span> {watch.ref}</p>
                    <p className='font-medium'><span className='font-semibold'>Movement:</span> {watch.mvmt}</p>
                    <p className='font-medium'><span className='font-semibold'>Case Material:</span> {watch.casem}</p>
                    <p className='font-medium'><span className='font-semibold'>Bracelet Material:</span> {watch.bracem}</p>
                    <p className='font-medium'><span className='font-semibold'>Sex:</span> {watch.sex}</p>
                    {watch.discount > 0 ? (
                        <>
                            <p className='text-gray-500 line-through min-h-[1.25rem]'>${watch.price.toFixed(2)}</p>
                            <p className='text-2xl text-green-600 font-semibold'>
                                ${(watch.price * (1 - watch.discount / 100)).toFixed(2)}
                                <span className='ml-1 text-md text-red-500'>({watch.discount}% off)</span>
                            </p>
                        </>
                    ) : (
                        <>
                            <p className='text-gray-500 line-through min-h-[1.25rem]'></p>
                            <p className='text-2xl text-green-600 font-semibold'>${watch.price.toFixed(2)}</p>
                        </>
                    )}
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
            <div className='my-12'>
                <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-2 ml-2 sm:ml-4'>
                    Similar products
                </h1>
                <Showcase watches={recommendations} padding={0} />
            </div>
        </div>
    )
}

export default Product;