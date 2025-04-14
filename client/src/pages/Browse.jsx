import { useEffect, useState } from 'react';
import Showcase from '../components/Showcase';

function Browse() {
    const [watches, setWatches] = useState([]);
    const [filters, setFilters] = useState({
        brand: [],
        movement: [],
        caseMaterial: [],
        braceletMaterial: [],
        sex: []
    });
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
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

    const fetchData = () => {
        let params = new URLSearchParams(window.location.search);
        let queryParams = params.toString();
        let route = params.has('search') ? 'search' : 'browse';
        fetch(`${apiUrl}/${route}?${queryParams}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setWatches(data.data);
                    setTotalPages(data.totalPages);
                    setCurrentPage(data.page);
                }
            })
            .catch(error => console.error('Fetch failed:', error));
    }

    useEffect(() => {
        fetchFilter();
        fetchData();
        const handlePopState = () => fetchData();
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const updateURL = (newParams) => {
        let params = new URLSearchParams(window.location.search);
        Object.keys(newParams).forEach(key => {
            if (newParams[key] !== undefined && newParams[key] !== '') {
                params.set(key, newParams[key]);
            }
            else {
                params.delete(key);
            }
        })
        window.history.replaceState(null, '', `?${params.toString()}`);
        fetchData();
    }

    const handleSort = (event) => {
        const value = event.target.value;
        let sortBy = '';
        let order = '';
        switch (value) {
            case 'sold-desc':
                sortBy = 'sold';
                order = 'desc';
                break;
            case 'createdAt-desc':
                sortBy = 'createdAt';
                order = 'desc';
                break;
            case 'price-desc':
                sortBy = 'price';
                order = 'desc';
                break;
            case 'price-asc':
                sortBy = 'price';
                order = 'asc';
                break;
            default:
                break;
        }
        updateURL({ sortBy, order, page: 1 });
    }

    const changePage = (newPage) => {
        updateURL({ page: newPage });
    }

    const changeFilter = (event) => {
        const { name, value } = event.target;
        updateURL({ [name]: value, page: 1 });
    }

    return (
        <div className='flex flex-col justify-between items-center my-5'>
            <div className='flex flex-wrap item-center gap-4 px-5 py-4 text-sm'>
                {[
                    { label: 'Brand', name: 'brand', options: filters.brand },
                    { label: 'Movement type', name: 'mvmt', options: filters.movement },
                    { label: 'Case material', name: 'casem', options: filters.caseMaterial },
                    { label: 'Brace material', name: 'bracem', options: filters.braceletMaterial }
                ].map(({ label, name, options }) => (
                    <div key={name}>
                        <label className='sr-only'>{label}: </label>
                        <select name={name} onChange={changeFilter} defaultValue=''
                            className='custom-filter-color border border-gray-200 rounded-lg px-3 py-2 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-slate-200'
                        >
                            <option value=''>All {label.toLowerCase()}s</option>
                            {options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                ))}
                <div>
                    <label className='sr-only'>Sex: </label>
                    <select name='sex' onChange={changeFilter} defaultValue=''
                        className='custom-filter-color border border-gray-200 rounded-lg px-3 py-2 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-slate-200'
                    >
                        <option value=''>All sexes</option>
                        <option value='Men'>Men</option>
                        <option value='Women'>Women</option>
                    </select>
                </div>
                <div className='ml-auto'>
                    <label className='text-sm mr-2'>Sort by</label>
                    <select
                        onChange={handleSort}
                        defaultValue=''
                        className='custom-filter-color border border-gray-200 rounded-md px-3 py-2 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-slate-200'
                    >
                        <option value=''>None</option>
                        <option value='sold-desc'>Best Seller</option>
                        <option value='price-desc'>Price High to Low</option>
                        <option value='price-asc'>Price Low to High</option>
                        <option value='createdAt-desc'>Newest</option>
                    </select>
                </div>

            </div>
            <Showcase
                title=''
                watches={watches} />
            <div className='text-center mt-4'>
                <button
                    disabled={currentPage <= 1}
                    onClick={() => changePage(currentPage - 1)}
                >
                    Previous
                </button>

                <span> Page: {currentPage} / {totalPages} </span>

                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => changePage(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Browse;