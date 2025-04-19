import { useState } from 'react';
import { FaTrash } from 'react-icons/fa6';

function CartWatchCard({ watch, quantity, navigate }) {
    const [imgIndex, setImgIndex] = useState(0);

    const handleImg = () => {
        if (imgIndex < watch.image_url.length - 1) {
            setImgIndex(prev => prev + 1);
        }
    };

    const imgSrc = watch.image_url[imgIndex];

    return (
        <div key={watch.watch_id}
            className='md:mx-25 my-1 p-4 shadow-sm bg-neutral-50 rounded-xl flex flex-col sm:flex-row transform transition-transform duration-300 ease-in-out hover:scale-102 hover:-translate-y-1 hover:shadow-md'>
            <div className='flex justify-center sm:justify-start'>
                <img src={imgSrc} alt={watch.name}
                    className='w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-cover rounded-md'
                    onError={handleImg}
                />
            </div>
            <div className='flex flex-col justify-between flex-grow ml-5 sm:ml-15'>
                <h3 className='text-md md:text-lg font-semibold mt-2 line-clamp'>{watch.name}</h3>
                <p className='text-gray-500 text-xs md:text-md'>Brand: {watch.brand}</p>
                <p className='text-green-600 font-semibold text-sm md:text-lg'>${watch.price}</p>
                <p className='text-gray-500 text-xs md:text-md'>Quantity: {quantity}</p>
                <div className='flex items-center space-x-2'>
                <button
                    className='bg-gray-300 px-2 py-1 rounded hover:bg-gray-400 text-sm'
                    onClick={() => {}}>
                    -
                </button>
                <span className='text-sm md:text-base'>{quantity}</span>
                <button
                    className='bg-gray-300 px-2 py-1 rounded hover:bg-gray-400 text-sm'
                    onClick={() => {}}>
                    +
                </button>
            </div>
            <div className='flex items-center space-x-2 mt-2 md:mt-0'>
                <button
                    onClick={() => navigate(`/product/${watch.watch_id}`)}
                    className='bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300 transition-colors'>
                    View Details
                </button>
                <button
                    className='bg-red-200 text-red-700 px-3 py-1.5 rounded text-sm hover:bg-red-300 transition-colors'
                    onClick={() => {}}>
                        <FaTrash />
                </button>
            </div>
            </div>
        </div>
    )
}

export default CartWatchCard;