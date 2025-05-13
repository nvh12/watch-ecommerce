import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa6';
import { useAuth } from '../contexts/AuthContext';
import ImageGallery from '../components/ImageGallery';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function ProductList() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [watches, setWatches] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [watchNumber, setWatchNumber] = useState(0);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${apiUrl}/browse?page=${currentPage}`);
            const result = await response.json();
            if (result.status === 'success') {
                setWatches(result.data);
                setTotalPages(result.totalPages);
                setCurrentPage(result.page);
            }
            const res = await fetch(`${apiUrl}/product/number`);
            const data = await res.json();
            setWatchNumber(data.number);
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    }

    useEffect(() => {
        if (loading) return;
        if (!user) navigate('/auth/login');
        else if (user.role !== 'admin') navigate('/');
        else {
            fetchProducts();
        }
    }, [user, loading, currentPage]);

    return (
        <div className='px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-10'>
            <h1 className='text-3xl font-semibold text-gray-800 mb-8 text-center sm:text-left'>Product management</h1>
            <p className='text-gray-600 mb-4'>
                Total watches: <span className='font-medium'>{watchNumber}</span>
            </p>
            <div className='bg-neutral-50 rounded-xl shadow-sm p-4 sm:p-6 mb-7'>
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => navigate('/admin/product/create')}
                        className='bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300 transition-colors'>
                        Add Product
                    </button>
                </div>
                <div className='grid gap-4 grid-row'>
                    {watches.map((watch) => (
                        <div key={watch.watch_id}
                            className='rounded-lg p-4 bg-neutral-50 shadow-sm flex flex-row justify-between gap-4 items-start sm:items-center transform transition-transform duration-300 ease-in-out hover:scale-101 hover:-translate-y-1 hover:shadow-md'>
                            <div className='w-1/3 sm:w-1/4 flex justify-center sm:justify-start'>
                                <img src={watch.image_url[0]} alt={watch.name}
                                    className='w-24 h-24 md:w-32 md:h-32 object-cover rounded-md'
                                />
                            </div>
                            <div className='w-2/3 sm:w-3/4 flex-grow justify-between ml-5 sm:ml-10'>
                                <h3 className='text-md sm:text-lg font-semibold mt-0 line-clamp'>{watch.name}</h3>
                                <p className='text-gray-500 text-xs md:text-md'>Brand: {watch.brand}</p>
                                <div className='flex items-center justify-between mt-2'>
                                    <p className='text-green-600 font-semibold text-sm md:text-base'>${watch.price}</p>
                                    <p className='text-sm md:text-base'>Stock: {watch.stock}</p>
                                    <p className='text-sm md:text-base'>Sold: {watch.sold}</p>
                                </div>
                                <div className='flex items-center mt-3'>
                                    <button
                                        onClick={() => navigate(`/admin/product/${watch.watch_id}`)}
                                        className='bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300 transition-colors'>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='text-center mt-6 flex items-center justify-center gap-4'>
                    <button
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
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
                        onClick={() => setCurrentPage(currentPage + 1)}
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
    );
}

function ManageProduct() {
    const navigate = useNavigate();
    const [watch, setWatch] = useState({});
    const { user, loading } = useAuth();
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState(watch);
    const { id } = useParams();

    const fetchProduct = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/product/${id}`);
            const result = await response.json();
            if (result.status === 'success') {
                setWatch(result.watch);
                setEditData(result.watch);
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditData({ ...editData, [name]: value });
    }

    const handleSave = async () => {
        try {
            const response = await fetch(`${apiUrl}/admin/product/${watch._id}`, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                method: 'PUT',
                body: JSON.stringify(editData)
            });
            const result = await response.json();
            if (result.status === 'success') {
                setWatch(result.watch);
            }
        } catch (error) {
            console.error('Failed to update:', error);
        }
        setEditing(false);
    }

    const handleImageUrlChange = (index, newValue) => {
        const updatedUrls = [...editData.image_url];
        updatedUrls[index] = newValue;
        setEditData({ ...editData, image_url: updatedUrls });
    };

    const handleAddImageUrl = () => {
        setEditData({ ...editData, image_url: [...(editData.image_url || []), ''] });
    };

    const handleRemoveImageUrl = (index) => {
        const updatedUrls = [...editData.image_url];
        updatedUrls.splice(index, 1);
        setEditData({ ...editData, image_url: updatedUrls });
    };

    useEffect(() => {
        if (loading) return;
        if (!user) navigate('/auth/login');
        else if (user.role !== 'admin') navigate('/');
        else {
            fetchProduct(id);
        }
    }, [user, loading]);

    return (
        <div className='px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-10'>
            {!(watch && watch.name && editing) ? (
                <div className='bg-neutral-50 rounded-xl shadow-sm p-4 sm:p-6 mb-7'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-6'>{watch.name}</h2>
                    <div className='flex flex-col sm:flex-row space-x-5 space-y-5'>
                        <ImageGallery imageURLs={watch.image_url} name={watch.name} />
                        <div className='flex flex-col gap-2 mr-auto'>
                            <p><span className='font-semibold'>Brand:</span> {watch.brand}</p>
                            <p><span className='font-semibold'>Model:</span> {watch.model}</p>
                            <p><span className='font-semibold'>Ref:</span> {watch.ref}</p>
                            <p><span className='font-semibold'>Movement:</span> {watch.mvmt}</p>
                            <p><span className='font-semibold'>Case material:</span> {watch.casem}</p>
                            <p><span className='font-semibold'>Brace material:</span> {watch.bracem}</p>
                            <p><span className='font-semibold'>Image URLs:</span></p>
                            {watch.image_url?.map((url, index) => (
                                <p key={index}>{url}</p>
                            ))}
                            <p><span className='font-semibold'>Price:</span> ${watch.price}</p>
                            <p><span className='font-semibold'>Stock:</span> {watch.stock}</p>
                            <p><span className='font-semibold'>Sold:</span> {watch.sold}</p>
                            <p><span className='font-semibold'>Sex:</span> {watch.sex}</p>
                            <p><span className='font-semibold'>Description:</span></p>
                            <p>{watch.description}</p>
                            <button onClick={() => setEditing(true)} className='bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm mt-1 hover:bg-gray-300 transition-colors'>
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='bg-neutral-50 rounded-xl shadow-sm p-4 sm:p-6 mb-7'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-6'>Edit product</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1'>Name</label>
                            <input name='name' value={editData.name} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1'>Brand</label>
                            <input name='brand' value={editData.brand} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1'>Model</label>
                            <input name='model' value={editData.model} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1'>Reference</label>
                            <input name='ref' value={editData.ref} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1'>Movement</label>
                            <input name='mvmt' value={editData.mvmt} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1'>Case Material</label>
                            <input name='casem' value={editData.casem} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1'>Bracelet Material</label>
                            <input name='bracem' value={editData.bracem} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1'>Price ($)</label>
                            <input name='price' type='number' value={editData.price} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1'>Stock</label>
                            <input name='stock' type='number' value={editData.stock} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1'>Sold</label>
                            <input name='sold' type='number' value={editData.sold} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1'>Sex</label>
                            <select name='sex' defaultValue={editData.sex} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition'>
                                <option value='Men'>Men</option>
                                <option value='Women'>Women</option>
                            </select>
                        </div>
                    </div>
                    <div className='mt-6'>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Image URLs</label>
                        <div className='space-y-3'>
                            {editData.image_url?.map((url, index) => (
                                <div key={index} className='flex gap-2'>
                                    <input
                                        type='text'
                                        value={url}
                                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                        className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => handleRemoveImageUrl(index)}
                                        className='bg-red-300 text-red-700 px-3 py-1.5 rounded text-sm hover:bg-red-400 transition-colors'
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type='button'
                                onClick={handleAddImageUrl}
                                className='mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                            >
                                Add Image URL
                            </button>
                        </div>
                    </div>
                    <div className='mt-6'>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Description</label>
                        <textarea name='description' value={editData.description} onChange={handleChange} rows='4' className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>

                    <div className='flex gap-4 mt-8'>
                        <button onClick={handleSave} className='bg-green-600 text-white px-5 py-2 rounded text-sm mt-1 hover:bg-green-700'>Save</button>
                        <button onClick={() => setEditing(false)} className='bg-gray-200 text-gray-700 px-5 py-2 rounded text-sm mt-1 hover:bg-gray-300 transition-colors'>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

function CreateProduct() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [editData, setEditData] = useState({
        name: '',
        brand: '',
        model: '',
        ref: '',
        mvmt: '',
        casem: '',
        bracem: '',
        price: '',
        stock: '',
        sold: '',
        sex: 'Men',
        image_url: [],
        description: '',
    });


    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditData({ ...editData, [name]: value });
    }

    const handleSave = async () => {
        try {
            const response = await fetch(`${apiUrl}/admin/product`, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(editData)
            });
            const result = await response.json();
            if (result.status === 'success') {
                setWatch(result.watch);
            }
        } catch (error) {
            console.error('Failed to update:', error);
        }
        navigate('/admin/product');
    }

    const handleImageUrlChange = (index, newValue) => {
        const updatedUrls = [...editData.image_url];
        updatedUrls[index] = newValue;
        setEditData({ ...editData, image_url: updatedUrls });
    };

    const handleAddImageUrl = () => {
        setEditData({ ...editData, image_url: [...(editData.image_url || []), ''] });
    };

    const handleRemoveImageUrl = (index) => {
        const updatedUrls = [...editData.image_url];
        updatedUrls.splice(index, 1);
        setEditData({ ...editData, image_url: updatedUrls });
    };

    return (
        <div className='px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-10'>
            <div className='bg-neutral-50 rounded-xl shadow-sm p-4 sm:p-6 mb-7'>
                <h2 className='text-xl font-semibold text-gray-800 mb-6'>Create product</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Name</label>
                        <input name='name' value={editData.name} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Brand</label>
                        <input name='brand' value={editData.brand} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Model</label>
                        <input name='model' value={editData.model} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Reference</label>
                        <input name='ref' value={editData.ref} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Movement</label>
                        <input name='mvmt' value={editData.mvmt} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Case Material</label>
                        <input name='casem' value={editData.casem} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Bracelet Material</label>
                        <input name='bracem' value={editData.bracem} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Price ($)</label>
                        <input name='price' type='number' value={editData.price} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Stock</label>
                        <input name='stock' type='number' value={editData.stock} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Sold</label>
                        <input name='sold' type='number' value={editData.sold} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Sex</label>
                        <select name='sex' value={editData.sex} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition'>
                            <option value='Men'>Men</option>
                            <option value='Women'>Women</option>
                        </select>
                    </div>
                </div>
                <div className='mt-6'>
                    <label className='block text-sm font-semibold text-gray-700 mb-1'>Image URLs</label>
                    <div className='space-y-3'>
                        {editData.image_url?.map((url, index) => (
                            <div key={index} className='flex gap-2'>
                                <input
                                    type='text'
                                    value={url}
                                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                    className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition'
                                />
                                <button
                                    type='button'
                                    onClick={() => handleRemoveImageUrl(index)}
                                    className='bg-red-300 text-red-700 px-3 py-1.5 rounded text-sm hover:bg-red-400 transition-colors'
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        <button
                            type='button'
                            onClick={handleAddImageUrl}
                            className='mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                        >
                            Add Image URL
                        </button>
                    </div>
                </div>
                <div className='mt-6'>
                    <label className='block text-sm font-semibold text-gray-700 mb-1'>Description</label>
                    <textarea name='description' value={editData.description} onChange={handleChange} rows='4' className='w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition' />
                </div>

                <div className='flex gap-4 mt-8'>
                    <button onClick={handleSave} className='bg-green-600 text-white px-5 py-2 rounded text-sm mt-1 hover:bg-green-700'>Save</button>
                    <button onClick={() => navigate('/admin/product')} className='bg-gray-200 text-gray-700 px-5 py-2 rounded text-sm mt-1 hover:bg-gray-300 transition-colors'>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export { ProductList, ManageProduct, CreateProduct };