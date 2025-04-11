import { useState } from 'react';

function WatchCard({ watch, navigate }) {
    const [imgIndex, setImgIndex] = useState(0);

    const handleImg = () => {
        if (imgIndex < watch.image_url.length - 1) {
            setImgIndex(prev => prev + 1);
        }
    };

    const imgSrc = watch.image_url[imgIndex];

    return (
        <div key={watch.watch_id}
            className='p-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-xl text-center flex flex-col justify-between'>
            <div>
                <img src={imgSrc} alt={watch.name}
                    className='w-full h-48 object-cover rounded-md'
                    onError={handleImg} 
                    />
                <h3 className='text-xl font-semibold mt-2 line-clamp'>{watch.name}</h3>
            </div>
            <div className='flex flex-col'>
                <p className='text-gray-500'>Brand: {watch.brand}</p>
                <p className='text-green-600 font-bold'>Price: ${watch.price}</p>
                <p className={`mt-2 ${watch.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {watch.stock > 0 ? `In Stock: ${watch.stock}` : 'Out of Stock'}
                </p>
                <button onClick={() => navigate(`/product/${watch.watch_id}`)}
                    className='bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600'>
                    View Details
                </button>
            </div>
        </div>
    )
}

export default WatchCard;