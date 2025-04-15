import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Register() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        password2: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.password !== formData.password2) {
            alert('Passwords do not match!');
            return;
        }
        if (!formData.email || !formData.username || !formData.password || !formData.password2) {
            alert('Please fill in all fields.');
            return;
        }
        try {
            setLoading(true);
            const { username, email, password } = formData;
            await register({ name: username, email, password });
            navigate('/');
        }
        catch (error) {
            console.error('Error:', error);
            alert('Failed to submit.');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center py-12 px-4'>
            <form onSubmit={handleSubmit} className='bg-neutral-50 shadow-md rounded-2xl p-8 w-96 space-y-6'>
                <h2 className='text-2xl font-bold text-gray-800 text-center'>Create a new account</h2>
                {['email', 'username', 'password', 'password2'].map((field, index) => (
                    <div key={index}>
                        <label htmlFor={field} className='block text-sm text-gray-600 mb-1'>
                            {field === 'password2' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}:
                        </label>
                        <input
                            type={field.includes('password') ? 'password' : 'text'}
                            id={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded-lg bg-neutral-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400  transition'
                        />
                    </div>
                ))}
                <div className='flex justify-end'>
                    <button type='submit' disabled={loading}
                        className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>{loading ? 'Loading' : 'Sign up'}</button>
                </div>
            </form>
        </div>
    );
}

function Login() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.identifier || !formData.password) {
            alert('Please fill in all fields.');
            return;
        }
        try {
            setLoading(true);
            await login(formData);
            navigate('/');
        }
        catch (error) {
            console.error('Error:', error);
            alert(error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center py-10'>
            <form onSubmit={handleSubmit} className='bg-neutral-50 shadow-md rounded-2xl p-8 w-96 space-y-6'>
                <h2 className='text-2xl font-bold text-gray-800 text-center'>Log in</h2>
                <div>
                    <label htmlFor='identifier' className='block text-sm text-gray-600 mb-1'>Email or Username:</label>
                    <input type='text' id='identifier' name='identifier' value={formData.identifier} onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-lg bg-neutral-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400  transition' />
                </div>
                <div>
                    <label htmlFor='password' className='block text-sm text-gray-600 mb-1'>Password:</label>
                    <input type='password' id='password' name='password' value={formData.password} onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-lg bg-neutral-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400  transition' />
                </div>
                <div className='flex justify-end'>
                    <button type='submit' disabled={loading}
                        className='px-4 py-2 bg-[#2b2c2d] text-white rounded-lg hover:bg-[#2a2a2a] hover:bg-slate-700 transition-colors disabled:opacity-50'>{loading ? 'Loading' : 'Sign in'}</button>
                </div>
            </form>
        </div>
    )
}

export { Register, Login }