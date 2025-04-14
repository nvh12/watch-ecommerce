import { FaUser, FaCartShopping } from 'react-icons/fa6'
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function CartandLoginButtons({ className = '' }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, []);

    const handleNavigate = (path) => {
        navigate(path);
        setDropdownOpen(false);
    }

    return (
        <div className={`${className} flex items-center gap-2`} ref={dropdownRef}>
            <button
                className='p-2 hover:ring hover:ring-neutral-200 rounded-full'
                onClick={() => navigate('/cart')}
            >
                <FaCartShopping />
            </button>
            <div className='relative'>
                <button
                    className='p-2 hover:ring hover:ring-neutral-200 rounded-full'
                    onClick={() => setDropdownOpen(state => !state)}
                >
                    <FaUser />
                </button>
                {dropdownOpen && (
                    <div className='absolute right-0 mt-2 w-40 bg-white text-black border-gray-200 rounded-lg shadow-lg z-50'>
                        {user ? (
                            <>
                                <button
                                    onClick={() => handleNavigate('/user')}
                                    className='w-full text-left px-4 py-2 hover:bg-gray-100'
                                >
                                    {user.name}
                                </button>
                                <button
                                    onClick={() => {
                                        logout();
                                        setDropdownOpen(false);
                                    }}
                                    className='w-full text-left px-4 py-2 hover:bg-gray-100'
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleNavigate('/auth/login')}
                                    className='w-full text-left px-4 py-2 hover:bg-gray-100'
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => handleNavigate('/auth/register')}
                                    className='w-full text-left px-4 py-2 hover:bg-gray-100'
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartandLoginButtons;