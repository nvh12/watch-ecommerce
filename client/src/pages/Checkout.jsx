import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

function Checkout() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const [itemList, setItemList] = useState([]);
    const [total, setTotal] = useState(0);
    const [ordered, setOrdered] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        payment: '',
        delivery: '',
        address: ''
    });
    const navigate = useNavigate();
    const { user, loading } = useAuth();

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
                toast('Failed to load', { autoClose: 3000 });
            }
        } else {
            cartItems = cart;
        }
        try {
            const combined = cartItems.map((item, index) => ({
                product: item.product,
                quantity: item.quantity
            }));
            setItemList(combined);
            let newTotal = combined.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
            setTotal(newTotal);
        } catch (error) {
            toast('Failed to load', { autoClose: 3000 });
        }
    };

    const handleCheckout = async (formData) => {
        const response = await fetch(`${apiUrl}/cart/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                userId: formData.userId,
                payment: formData.payment,
                delivery: formData.delivery,
                address: formData.address
            })
        });
        const result = await response.json();
        if (response.ok) {
            toast('Check out successful!', { autoClose: 3000 });
        } else {
            throw new Error(result.error);
        }
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.payment || !formData.delivery) {
            toast('Please fill in all fields.', { autoClose: 3000 });
            return;
        }
        if (ordered) {
            toast('Order already placed.', { autoClose: 3000 });
            return;
        }
        try {
            await handleCheckout(formData);
            setOrdered(true);
        }
        catch (error) {
            console.error('Error:', error);
            alert(error);
        }
    }

    useEffect(() => {
        if (loading) return;
        if (!user) navigate('/auth/login');
        else {
            setFormData(prev => ({
                ...prev,
                userId: user.id
            }));
            loadData();
        }
    }, [loading, user]);

    return (
        <div className='mx-auto my-10 px-4'>
            <h2 className='text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-5 ml-12'>
                Checkout
            </h2>
            <div className='flex flex-col lg:flex-row justify-between'>
                <div className='md:mx-15 flex-1 bg-neutral-50 rounded-lg shadow-sm p-4 mb-8'>
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <label className='block text-sm text-gray-600 mb-1'>
                                Delivery option
                            </label>
                            <select
                                name='delivery'
                                value={formData.delivery}
                                onChange={handleChange}
                                className='w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-400 transition'
                            >
                                <option value=''>Choose delivery option</option>
                                <option value='store'>Store</option>
                                <option value='delivery'>Delivery</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-sm text-gray-600 mb-1'>
                                Address
                            </label>
                            <input
                                type='text'
                                name='address'
                                value={formData.address}
                                onChange={handleChange}
                                className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition'
                            />
                        </div>
                        <div>
                            <label className='block text-sm text-gray-600 mb-1'>Payment method</label>
                            <select
                                name='payment'
                                value={formData.payment}
                                onChange={handleChange}>
                                <option value=''>Choose payment option</option>
                                <option value='cash'>Cash</option>
                                <option value='transfer'>Transfer</option>
                            </select>
                        </div>
                        <div>
                            <p className='text-sm text-gray-600 mt-2'>QR for transfer payment</p>
                            <img
                                src='/images/qr-placeholder.png'
                                alt='QR Code'
                                className='w-44 h-44 object-contain mt-2'
                            />
                        </div>
                        <div className='pt-4'>
                            <button
                                type='submit'
                                disabled={ordered}
                                className={`w-full text-white my-2 py-2 rounded-lg text-md
                                    ${ordered ?
                                        'bg-gray-400 cursor-not-allowed text-white' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                {ordered ? 'Order Placed' : 'Place Order'}
                            </button>
                        </div>
                    </form>
                </div>
                <div className='w-full lg:w-1/4 mr-7 p-4 bg-neutral-50 rounded-lg h-fit shadow-sm'>
                    <h2 className='text-md text-center font-semibold'>Products</h2>
                    {itemList.map((item) => {
                        let imgIndex = 0;
                        if (imgIndex < item.product.image_url.length - 1) {
                            imgIndex++;
                        }
                        const imgSrc = item.product.image_url[imgIndex];
                        return (
                            <div key={item.product.watch_id}
                                className='my-1 p-1 shadow-sm bg-neutral-50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center'>
                                <div className='w-1/3 sm:w-1/4 flex justify-center'>
                                    <img src={imgSrc} alt={item.product.name}
                                        className='w-18 h-18 md:w-24 md:h-24 object-cover rounded-md'
                                    />
                                </div>
                                <div className='w-2/3 sm:w-3/4 flex-grow justify-between ml-5 sm:ml-10'>
                                    <h3 className='text-sm sm:text-md font-semibold mt-0 line-clamp'>{item.product.name}</h3>
                                    <div className='flex items-center justify-between mt-2'>
                                        <p className='text-green-600 font-semibold text-sm md:text-md'>${item.product.price}</p>
                                        <p className='text-gray-800 text-sm md:text-md'>Quantity: {item.quantity}</p>
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
                    <div>
                        <p>Total: ${total}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout;