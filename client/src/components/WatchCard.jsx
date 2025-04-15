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
            className='p-4 shadow-sm bg-neutral-50 rounded-xl text-center flex flex-col justify-around transform transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-md'>
            <div>
                <img src={imgSrc} alt={watch.name}
                    className='w-full h-48 object-cover rounded-md'
                    onError={handleImg} 
                    />
                <h3 className='text-md font-semibold mt-2 line-clamp'>{watch.name}</h3>
            </div>
            <div className='flex flex-col'>
                <p className='text-gray-500 text-sm'>Brand: {watch.brand}</p>
                <p className='text-green-600 font-semibold text-md'>${watch.price}</p>
                <button onClick={() => navigate(`/product/${watch.watch_id}`)}
                    className='bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm mt-1 hover:bg-gray-300 transition-colors'>
                    View Details
                </button>
            </div>
        </div>
    )
}

export default WatchCard;