import { useEffect, useState } from 'react';
import { FaMagnifyingGlass, FaBars, FaXmark } from 'react-icons/fa6';
import CartandLoginButtons from './CartandLoginButtons';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [filters, setFilters] = useState({
        brands: [],
        movements: [],
        caseMaterials: [],
        braceletMaterials: [],
        sexes: []
    });
    const [search, setSearch] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    const fetchFilter = () => {
        fetch(`${apiUrl}/browse/filter`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setFilters(data.data);
                }
            })
            .catch(error => console.error('Fetch failed:', error));
    }

    useEffect(() => {
        fetchFilter();
    }, []);

    return (
        <div>
            <header className='custom-gray text-white static w-full top-0 left-0 shadow-sm'>
                <div className='container w-full mx-auto flex flex-col md:flex-row items-start md:items-center justify-between p-4'>
                    <div className='w-full flex items-center justify-between'>
                        <div className='flex items-center justify-between gap-x-2'>
                            <button onClick={() => setMenuOpen(!menuOpen)}
                                className='p-2 hover:ring hover:ring-neutral-0 rounded-full'
                            >
                                <FaBars />
                            </button>
                            <a className='text-2xl font-bold self-start' href='/'>WatchStore</a>
                        </div>
                        <CartandLoginButtons className='min-md:hidden' />
                    </div>
                    <div className='mt-4 md:mt-0 w-full md:w-auto flex flex-col md:flex-row items-center gap-2'>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (search.trim()) {
                                    window.location.href = `/search?search=${encodeURIComponent(search.trim())}`;
                                }
                            }}
                            className='mt-2 md:mt-0 w-full md:w-auto flex items-center bg-gray-200 text-gray-800 rounded-3xl px-2'>
                            <input
                                type='text'
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder='Search watches...'
                                className='p-2 outline-none bg-transparent w-full md:w-96'
                            />
                            <button
                                type='submit'
                                className='p-2 ml-auto hover:bg-gray-300 rounded-full'
                            >
                                <FaMagnifyingGlass />
                            </button>
                        </form>
                        <CartandLoginButtons className='hidden md:flex' />
                    </div>
                </div>
            </header>
            <div
                className={`fixed top-0 left-0 h-full w-4/5 md:w-1/2 lg:w-1/4 bg-gray-800 shadow-md z-50
                    transition transition-transform duration-300 ease-in-out 
                    ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
            >
                <div>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className='absolute top-4 right-4 text-white hover:text-gray-300 text-xl'
                    >
                        <FaXmark />
                    </button>
                </div>
                <div className='custom-gray text-white p-4 overflow-y-auto h-full'>
                    {Object.entries(filters).map(([key, values]) => (
                        <div key={key} className='mb-4'>
                            <p
                                className='font-bold uppercase pb-1 my-2 text-white'
                            >
                                {key.includes('Material') ? key.replace('Material', ' ') + 'material' : key}
                            </p>
                            <div className='flex flex-col gap-2'>
                                {values.map((value) => {
                                    let queryKey;
                                    switch (key) {
                                        case 'movement':
                                            queryKey = 'mvmt';
                                            break;
                                        case 'caseMaterial':
                                            queryKey = 'casem';
                                            break;
                                        case 'braceletMaterial':
                                            queryKey = 'bracem';
                                            break;
                                        default:
                                            queryKey = key;
                                    }
                                    return (
                                        <a
                                            key={value}
                                            href={`/browse?${queryKey}=${value}`}
                                            className='text-white pl-2 hover:text-gray-300 transition'
                                        >
                                            {value}
                                        </a>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {menuOpen && (
                <div className='hidden md:flex w-full custom-gray p-4'>
                    <div className='container mx-25 w-full flex items-start justify-around custom-gray'>
                        {Object.entries(filters).map(([key, values]) => (
                            <div key={key} className='custom-gray'>
                                <p className='font-semibold text-white uppercase'>
                                    {key.includes('Material') ? key.replace('Material', ' ') + 'material' : key}
                                </p>
                                <div className='mt-2 p-1 z-50'>
                                    <div className='flex flex-col gap-2'>
                                        {values.map((value) => {
                                            let queryKey;
                                            switch (key) {
                                                case 'movement':
                                                    queryKey = 'mvmt';
                                                    break;
                                                case 'caseMaterial':
                                                    queryKey = 'casem';
                                                    break;
                                                case 'braceletMaterial':
                                                    queryKey = 'bracem';
                                                    break;
                                                default:
                                                    queryKey = key;
                                            }
                                            return (
                                                <a
                                                    key={value}
                                                    href={`/browse?${queryKey}=${value}`}
                                                    className='text-white hover:text-gray-300 transition'
                                                >
                                                    {value}
                                                </a>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;