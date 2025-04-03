import { useState } from 'react';
import { FaMagnifyingGlass, FaBars } from 'react-icons/fa6';
import CartandLoginButtons from './CartandLoginButtons';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <header className='bg-gray-800 text-white static w-full top-0 left-0 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between p-4'>
                <div className='w-full flex items-center justify-between'>
                    <div className='flex items-center justify-between gap-x-2'>
                        <button to='/' className='p-2 bg-gray-700 hover:bg-blue-500 rounded-full'>
                            <FaBars />
                        </button>
                        <a className='text-2xl font-bold self-start' href='/'>WatchStore</a>
                    </div>
                    <CartandLoginButtons className='min-md:hidden' />
                </div>
                <div className='mt-4 md:mt-0 w-full md:w-auto flex flex-col md:flex-row items-center'>
                    <div className='mt-2 md:mt-0 w-full md:w-auto flex items-center bg-gray-200 text-gray-800 rounded-3xl px-2'>
                        <input
                            type='text'
                            placeholder='Search watches...'
                            className='p-2 outline-none bg-transparent'
                        />
                        <button className='p-2 ml-auto hover:bg-gray-300 rounded-full'>
                            <FaMagnifyingGlass />
                        </button>
                    </div>
                    <CartandLoginButtons className='hidden md:flex' />
                </div>
            </div>
        </header>
    );
}

export default Header;