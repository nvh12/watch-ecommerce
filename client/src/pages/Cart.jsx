import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa6';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

function Cart() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const [itemList, setItemList] = useState([]);
    const [total, setTotal] = useState(0);
    const { cart, addItem, reduceItem, removeItem, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const loadData = async () => {
        let cartItems = [];
        if (user) {
            try {
                const response = await fetch(`${apiUrl}/cart`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.status === 'success') {
                    cartItems = data.data.items;
                }
            } catch (error) {
                console.error('Fetch failed:', error);
            }
        } else {
            cartItems = cart;
        }
        try {
            const combined = cartItems.map((item) => ({
                product: item.product,
                quantity: item.quantity
            }));
            setItemList(combined);
            let newTotal = combined.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
            setTotal(newTotal);
        } catch (error) {
            console.error(error);
        }
    };

    const addProduct = async (itemId, price) => {
        if (user) {
            const response = await fetch(`${apiUrl}/cart/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    product: itemId,
                    price: price
                })
            });
            const result = await response.json();
            if (result.status !== 'success') {
                console.error('Add to cart failed:', result.message);
            }
        } else {
            addItem({ product: itemId, price: price });
        }
        loadData();
    }

    const reduceProduct = async (itemId, price) => {
        if (user) {
            const response = await fetch(`${apiUrl}/cart/reduce`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    product: itemId,
                    price: price
                })
            });
            const result = await response.json();
            if (result.status !== 'success') {
                console.error('Add to cart failed:', result.message);
            }
        } else {
            reduceItem({ product: itemId, price: price });
        }
        loadData();
    }

    const deleteProduct = async (itemId, price) => {
        if (user) {
            const response = await fetch(`${apiUrl}/cart/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    product: itemId,
                    price: price
                })
            });
            const result = await response.json();
            if (result.status !== 'success') {
                console.error('Add to cart failed:', result.message);
            }
        } else {
            removeItem({ product: itemId, price: price });
        }
        loadData();
    }

    useEffect(() => {
        loadData();
    }, [user, cart]);

    if (itemList.length === 0) {
        return (
            <div className='flex flex-col my-16'>
                <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-4 ml-6 sm:ml-10'>
                    Cart
                </h1>
                <p className='ml-6 sm:ml-10'>No product in cart</p>
            </div>
        )
    }

    return (
        <div className='mx-auto my-10 px-4'>
            <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-5 ml-12'>
                Cart
            </h1>
            <div className='flex flex-col lg:flex-row justify-between'>
                <div className='flex-1'>
                    {itemList.map((item) => {
                        return (
                            <div key={item.product.watch_id}
                                className='md:mx-15 my-1 p-4 shadow-sm bg-neutral-50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center transform transition-transform duration-300 ease-in-out hover:scale-101 hover:-translate-y-1 hover:shadow-md'>
                                <div className='w-1/3 sm:w-1/4 flex justify-center sm:justify-start'>
                                    <img src={item.product.image_url[0]} alt={item.product.name}
                                        className='w-24 h-24 md:w-32 md:h-32 object-cover rounded-md'
                                    />
                                </div>
                                <div className='w-2/3 sm:w-3/4 flex-grow justify-between ml-5 sm:ml-10'>
                                    <h3 className='text-md sm:text-lg font-semibold mt-0 line-clamp'>{item.product.name}</h3>
                                    <p className='text-gray-500 text-xs md:text-md'>Brand: {item.product.brand}</p>
                                    <div className='flex items-center justify-between mt-2'>
                                        <p className='text-green-600 font-semibold text-sm md:text-base'>${item.product.price}</p>
                                        <div className='flex items-center mt-2 space-x-2'>
                                            <button
                                                className='bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 text-sm'
                                                onClick={() => { reduceProduct(item.product._id, item.product.price) }}>
                                                -
                                            </button>
                                            <span className='text-sm'>{item.quantity}</span>
                                            <button
                                                className='bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 text-sm'
                                                onClick={() => { addProduct(item.product._id, item.product.price) }}>
                                                +
                                            </button>
                                            <button
                                                className='bg-red-300 text-red-700 px-3 py-1.5 rounded text-sm hover:bg-red-400 transition-colors'
                                                onClick={() => { deleteProduct(item.product._id, item.product.price) }}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                    <div className='flex space-x-2 mt-2 md:mt-0'>
                                        <button
                                            onClick={() => navigate(`/product/${item.product.watch_id}`)}
                                            className='bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300 transition-colors'>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='w-full lg:w-1/4 mr-7 p-4 bg-neutral-50 rounded-lg h-fit shadow-sm'>
                    <h2 className='text-xl text-center font-semibold mb-4'>Order info</h2>
                    <div className='flex justify-between text-lg font-semibold mb-20'>
                        <span>Total:</span>
                        <span className='text-green-600'>${total.toFixed(2)}</span>
                    </div>
                    <button
                        className='w-full bg-red-600 text-white my-2 py-2 rounded-lg text-md hover:bg-red-700'
                        onClick={() => navigate('/cart/checkout')}
                    >
                        Check out
                    </button>
                    <button
                        className='w-full bg-gray-200 text-gray-700 my-2 py-2 rounded-lg text-md hover:bg-gray-300'
                        onClick={() => navigate('/browse')}
                    >
                        Continute shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;