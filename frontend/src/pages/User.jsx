import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import OrderCard from '../components/OrderCard';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function User() {
    const [userData, setUserData] = useState({});
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalCost, setTotalCost] = useState(0);

    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const fetchUser = async () => {
        try {
            const response = await fetch(`${apiUrl}/user`, {
                credentials: 'include'
            });
            const result = await response.json();
            if (result.status === 'success') setUserData(result.data);
        } catch (error) {
            toast(`Error: ${error}` || 'Failed to load user', { autoClose: 3000 });
        }
    };

    const fetchOrders = async (page) => {
        try {
            const query = `page=${page}`;
            const response = await fetch(`${apiUrl}/user/order?${query}`, {
                credentials: 'include'
            });
            const result = await response.json();
            if (result.status === 'success') {
                setOrders(result.data);
                setTotalPages(result.totalPages);
                setTotalOrders(result.totalOrders ?? 0);
                setTotalCost(result.totalCost ?? 0);
            }
        } catch (error) {
            toast(`Error: ${error}` || 'Failed to load orders', { autoClose: 3000 });
        }
    };

    const changePage = async (newPage) => {
        fetchOrders(newPage);
        setCurrentPage(newPage);
    }

    useEffect(() => {
        if (loading) return;
        if (!user) navigate('/auth/login');
        else {
            fetchUser();
            fetchOrders(1);
        }
    }, [user, loading]);

    return (
        <div className='px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-10'>
            <h1 className='text-3xl font-semibold text-gray-800 mb-8 text-center sm:text-left'>User</h1>
            <div className='bg-neutral-50 rounded-xl shadow-sm p-4 sm:p-6 mb-7'>
                <h2 className='text-xl font-semibold text-gray-800 mb-6'>Profile</h2>
                <div className='grid gap-x-6 gap-y-4 sm:grid-cols-2 text-sm sm:text-base text-gray-700'>
                    <div>
                        <p className='font-medium text-gray-500'>User ID</p>
                        <p>{userData.user_id ?? '—'}</p>
                    </div>
                    <div>
                        <p className='font-medium text-gray-500'>Name</p>
                        <p>{userData.name || '—'}</p>
                    </div>
                    <div>
                        <p className='font-medium text-gray-500'>Email</p>
                        <p>{userData.email || '—'}</p>
                    </div>
                    <div>
                        <p className='font-medium text-gray-500'>Joined At</p>
                        <p>{userData.createdAt ? new Date(userData.createdAt).toLocaleString() : '—'}</p>
                    </div>
                    <div>
                        <p className='font-medium text-gray-500'>Total Spent</p>
                        <p className='text-green-600'>${totalCost.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className='font-medium text-gray-500'>Total Orders</p>
                        <p>{totalOrders}</p>
                    </div>
                </div>
                <button onClick={() => navigate('/user/update')} className='bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm mt-1 hover:bg-gray-300 transition-colors'>
                    Edit
                </button>
            </div>
            <div>
                <h2 className='text-xl font-semibold text-gray-800 mb-4'>Orders</h2>
                <div className='grid gap-4 grid-row'>
                    {(orders.length === 0) && <div className='w-full border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-400'>
                        No orders yet.
                    </div>}
                    {orders.map(order => (
                        <OrderCard order={order} role={user.role} />
                    ))}
                </div>
                <div className='text-center mt-6 flex items-center justify-center gap-4'>
                    <button
                        disabled={currentPage <= 1}
                        onClick={() => changePage(currentPage - 1)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 
                            ${currentPage <= 1
                                ? 'bg-gray-200 text-gray-400'
                                : 'bg-neutral-100 hover:bg-neutral-200 text-gray-700 shadow-sm'}`}
                    >
                        Previous
                    </button>

                    <span className='text-sm text-gray-600'>
                        Page <span className='font-medium'>{currentPage}</span> of{' '}
                        <span className='font-medium'>{totalPages}</span>
                    </span>

                    <button
                        disabled={currentPage >= totalPages}
                        onClick={() => changePage(currentPage + 1)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 
                            ${currentPage >= totalPages
                                ? 'bg-gray-200 text-gray-400'
                                : 'bg-neutral-100 hover:bg-neutral-200 text-gray-700 shadow-sm'}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

function UserOrder() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const { id } = useParams();
    const [order, setOrder] = useState({
        items: [],
        total_price: 0,
        payment: '',
        delivery: '',
        address: '',
        status: '',
        createdAt: ''
    });

    const fetchOrder = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/user/order/${id}`, {
                credentials: 'include'
            });
            const result = await response.json();
            if (result.status === 'success') {
                setOrder(result.order);
            }
        } catch (error) {
            toast(`Error: ${error}` || 'Failed to load order', { autoClose: 3000 });
        }
    }

    useEffect(() => {
        if (loading) return;
        if (!user) navigate('/auth/login');
        else {
            fetchOrder(id);
        }
    }, [user, loading]);

    return (
        <div className='px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-10'>
            <h2 className='text-3xl font-semibold text-gray-800 mb-8 text-center sm:text-left'>
                Order
            </h2>
            <div className='bg-neutral-50 rounded-xl shadow-sm p-4 sm:p-6 mb-7'>
                <h2 className='text-xl font-semibold text-gray-800 mb-4'>Order info</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-gray-700 mb-6'>
                    <div>
                        <p className='text-gray-500 font-medium'>Order ID</p>
                        <p>{order._id}</p>
                    </div>
                    <div>
                        <p className='text-gray-500 font-medium'>Placed On</p>
                        <p>{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className='text-gray-500 font-medium'>Payment</p>
                        <p className='capitalize'>{order.payment}</p>
                    </div>
                    <div>
                        <p className='text-gray-500 font-medium'>Delivery</p>
                        <p className='capitalize'>{order.delivery}</p>
                    </div>
                    {order.delivery === 'delivery' && (
                        <div className='sm:col-span-2'>
                            <p className='text-gray-500 font-medium'>Delivery Address</p>
                            <p>{order.address}</p>
                        </div>
                    )}
                    <div>
                        <p className='text-gray-500 font-medium'>Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1
        ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'}`}>
                            {order.status}
                        </span>
                    </div>
                    <div>
                        <p className='text-gray-500 font-medium'>Total Price</p>
                        <p className='text-green-600 font-semibold'> ${order.total_price ? order.total_price.toFixed(2) : '0.00'}</p>
                    </div>
                </div>
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-4'>Items</h3>
            <div className='flex flex-col gap-3'>
                {order.items.map((item) => {
                    return (
                        <div key={item.product.watch_id}
                            className='my-1 p-4 shadow-sm bg-neutral-50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center transform transition-transform duration-300 ease-in-out hover:scale-101 hover:-translate-y-1 hover:shadow-md'>
                            <div className='w-1/3 sm:w-1/4 flex justify-center sm:justify-start'>
                                <img src={item.product.image_url[0]} alt={item.product.name}
                                    className='w-24 h-24 md:w-32 md:h-32 object-cover rounded-md'
                                />
                            </div>
                            <div className='w-2/3 sm:w-3/4 flex-grow justify-between ml-5 sm:ml-10'>
                                <h3 className='text-md sm:text-lg font-semibold mt-0 line-clamp'>{item.product.name}</h3>
                                <p className='text-gray-500 text-xs md:text-md'>Brand: {item.product.brand}</p>
                                <div className='flex flex-col items-start justify-between my-2'>
                                    <p className='text-sm text-gray-700'>Qty: {item.quantity}</p>
                                    <p className='text-green-600 font-semibold text-sm md:text-base'>${item.price}</p>
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
        </div>

    )
}

function UserUpdate() {
    const [editData, setEditData] = useState({});
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();
    const { user, loading, setUser } = useAuth();

    const fetchUser = async () => {
        try {
            const response = await fetch(`${apiUrl}/user`, {
                credentials: 'include'
            });
            const result = await response.json();
            if (result.status === 'success') {
                setUserData(result.data);
                setEditData({
                    name: result.data.name,
                    email: result.data.email,
                    password: '',
                    newPassword: ''
                });
            }
        } catch (error) {
            toast(`Error: ${error}` || 'Failed to load user', { autoClose: 3000 });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${apiUrl}/user/update`, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                method: 'PUT',
                body: JSON.stringify(editData)
            });
            const result = await response.json();
            if (result.status === 'success') {
                setUser({
                    id: result.data._id,
                    name: result.data.name,
                    email: result.data.email,
                    role: result.data.role
                });
                setUserData(result.data);
                navigate('/user');
                toast('Update successful!', { autoClose: 3000 })
            }
        } catch (error) {
            toast(`Error: ${error}` || 'Update failed', { autoClose: 3000 })
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!user) navigate('/auth/login');
        else {
            fetchUser();
        }
    }, [user, loading]);

    return (
        <div className='px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-10'>
            <div className='bg-neutral-50 rounded-xl shadow-sm p-4 sm:p-6 mb-7'>
                <h2 className='text-xl font-semibold text-gray-800 mb-6'>Update account</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Username</label>
                        <input name='name' value={editData.name} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Email</label>
                        <input name='email' value={editData.email} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Password</label>
                        <input name='password' type='password' value={editData.password} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>New password</label>
                        <input name='newPassword' type='password' value={editData.newPassword} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                </div>
                <div className='flex gap-4 mt-8'>
                    <button onClick={handleSave} className='bg-green-600 text-white px-5 py-2 rounded text-sm mt-1 hover:bg-green-700'>Save</button>
                </div>
            </div>
        </div>
    );
}

export { User, UserOrder, UserUpdate };