import { useEffect, useState } from 'react';
import Showcase from '../components/Showcase'

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
        console.log(`${apiUrl}/browse?${queryParams}`);
        fetch(`${apiUrl}/browse?${queryParams}`)
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

    const changeSort = (event) => {
        updateURL({ sortBy: event.target.value, page: 1 });
    }

    const changeOrder = (event) => {
        updateURL({ order: event.target.value, page: 1 });
    }

    const changePage = (newPage) => {
        updateURL({ page: newPage });
    }

    const changeFilter = (event) => {
        const { name, value } = event.target;
        updateURL({ [name]: value, page: 1 });
    }

    return (
        <div className='flex flex-col justify-between items-center'>
            <div className='flex flex-row justify-between items-center'>
                <div>
                    <label>Brand:</label>
                    <select name='brand' onChange={changeFilter} defaultValue=''>
                        <option value=''>All brands</option>
                        {filters.brand.map((brand) => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Movement type:</label>
                    <select name='mvmt' onChange={changeFilter} defaultValue=''>
                        <option value=''>All movement types</option>
                        {filters.movement.map((movement) => (
                            <option key={movement} value={movement}>{movement}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Case material:</label>
                    <select name='casem' onChange={changeFilter} defaultValue=''>
                        <option value=''>All materials</option>
                        {filters.caseMaterial.map((caseMaterial) => (
                            <option key={caseMaterial} value={caseMaterial}>{caseMaterial}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Brace material:</label>
                    <select name='bracem' onChange={changeFilter} defaultValue=''>
                        <option value=''>All materials</option>
                        {filters.braceletMaterial.map((braceletMaterial) => (
                            <option key={braceletMaterial} value={braceletMaterial}>{braceletMaterial}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Sex:</label>
                    <select name='sex' onChange={changeFilter} defaultValue=''>
                        <option value=''>All</option>
                        <option value='Men'>Men</option>
                        <option value='Women'>Women</option>
                    </select>
                </div>
                <div>
                    <label>Sort By:</label>
                    <select onChange={changeSort} defaultValue=''>
                        <option value=''>None</option>
                        <option value='sold'>Number sold</option>
                        <option value='price'>Price</option>
                        <option value='createdAt'>Date added</option>
                    </select>
                </div>
                <div>
                    <label>Order:</label>
                    <select onChange={changeOrder} defaultValue='asc'>
                        <option value='asc'>Ascending</option>
                        <option value='desc'>Descending</option>
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