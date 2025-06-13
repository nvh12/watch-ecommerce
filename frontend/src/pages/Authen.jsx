import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

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
            toast(`${error}`, { autoClose: 3000 });
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
                            {field === 'password2' ? 'Confirm password' : field.charAt(0).toUpperCase() + field.slice(1)}:
                        </label>
                        <input
                            type={field.includes('password') ? 'password' : 'text'}
                            id={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded-lg bg-neutral-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition'
                        />
                    </div>
                ))}
                <a href='/auth/login' className='underline hover:opacity-80'>Already have an account? Login</a>
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
            toast(`${error}`, { autoClose: 3000 });
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
                        className='w-full p-2 border border-gray-300 rounded-lg bg-neutral-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                </div>
                <div>
                    <label htmlFor='password' className='block text-sm text-gray-600 mb-1'>Password:</label>
                    <input type='password' id='password' name='password' value={formData.password} onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-lg bg-neutral-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                </div>
                <p><a href='/auth/register' className='underline hover:opacity-80'>Don't have an account? Register</a></p>
                <a href='/auth/reset' className='underline hover:opacity-80'>Forgot the password? Reset</a>
                <div className='flex justify-end'>
                    <button type='submit' disabled={loading}
                        className='px-4 py-2 bg-[#2b2c2d] text-white rounded-lg hover:bg-[#2a2a2a] hover:bg-slate-700 transition-colors disabled:opacity-50'>{loading ? 'Loading' : 'Sign in'}</button>
                </div>
            </form>
        </div>
    )
}

function Reset() {
    const [stage, setStage] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        password: '',
        password2: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    };

    const handleEmailSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/auth/code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            if (res.ok) {
                toast('Code sent!', { autoClose: 3000 });
                setStage(2);
            } else {
                toast('Failed to send reset code.', { autoClose: 3000});
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (event) => {
        event.preventDefault();
        if (formData.password !== formData.password2) {
            alert('Passwords do not match!');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/auth/reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    code: formData.code,
                    password: formData.password
                })
            });
            if (res.ok) {
                toast(`Password reset successful`, { autoClose: 3000 });
                navigate('/auth/login');
            } else {
                toast('Reset failed.', { autoClose: 3000 });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center py-10'>
            <form onSubmit={stage === 1 ? handleEmailSubmit : handleResetSubmit} className='bg-neutral-50 shadow-md rounded-2xl p-8 w-96 space-y-6'>
                <h2 className='text-2xl font-bold text-gray-800 text-center'>Reset password</h2>
                {stage === 1 && (
                    <div>
                        <label htmlFor='email' className='block text-sm text-gray-600 mb-1'>Email:</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded-lg bg-neutral-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition'
                            required
                        />
                    </div>
                )}
                {stage === 2 && (
                    <>
                        <div>
                            <label htmlFor='code' className='block text-sm text-gray-600 mb-1'>Verification Code:</label>
                            <input
                                type='text'
                                id='code'
                                name='code'
                                value={formData.code}
                                onChange={handleChange}
                                className='w-full p-2 border border-gray-300 rounded-lg bg-neutral-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition'
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor='password' className='block text-sm text-gray-600 mb-1'>New Password:</label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                className='w-full p-2 border border-gray-300 rounded-lg bg-neutral-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition'
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor='password2' className='block text-sm text-gray-600 mb-1'>Confirm Password:</label>
                            <input
                                type='password'
                                id='password2'
                                name='password2'
                                value={formData.password2}
                                onChange={handleChange}
                                className='w-full p-2 border border-gray-300 rounded-lg bg-neutral-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition'
                                required
                            />
                        </div>
                    </>
                )}
                <div className='flex justify-end'>
                    <button type='submit' disabled={loading}
                        className='px-4 py-2 bg-[#2b2c2d] text-white rounded-lg hover:bg-[#2a2a2a] hover:bg-slate-700 transition-colors disabled:opacity-50'>{loading ? 'Loading' : 'Submit'}</button>
                </div>
            </form>
        </div>
    );
}

export { Register, Login, Reset }