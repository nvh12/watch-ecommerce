import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function Admin() {
    const [userData, setUserData] = useState({});
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
    }

    useEffect(() => {
        if (loading) return;
        if (!user) navigate('/auth/login');
        else if (user.role !== 'admin') navigate('/');
        else {
            fetchUser();
        }
    }, [user, loading]);

    return (
        <div className='px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-10'>
            <h1 className='text-3xl font-semibold text-gray-800 mb-8 text-center sm:text-left'>Admin</h1>
            <div className='bg-neutral-50 border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 mb-7'>
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
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div
                    onClick={() => navigate('/admin/product')}
                    className='p-7 shadow-sm bg-neutral-50 rounded-xl text-start flex flex-col justify-around transform transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-md'
                >
                    <h3 className='text-xl text-gray-800 font-semibold mb-2'>Product Management</h3>
                    <p className='text-gray-700'>Manage all store products.</p>
                </div>

                <div
                    onClick={() => navigate('/admin/order')}
                    className='p-7 shadow-sm bg-neutral-50 rounded-xl text-start flex flex-col justify-around transform transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-md'
                >
                    <h3 className='text-xl text-gray-800 font-semibold mb-2'>Order Management</h3>
                    <p className='text-gray-700'>Manage customer orders.</p>
                </div>
            </div>
        </div>
    )
}

export default Admin;