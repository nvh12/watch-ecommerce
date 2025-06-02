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
            className='p-4 shadow-sm bg-neutral-50 rounded-xl text-center flex flex-col justify-between transform transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-md h-full'>
            <div>
                <img src={imgSrc} alt={watch.name}
                    className='w-full h-48 object-cover rounded-md'
                    onError={handleImg}
                />
                <h3 className='text-sm font-semibold mt-2 line-clamp'>{watch.name}</h3>
            </div>
            <div className='flex flex-col'>
                <p className='text-gray-500 text-xs'>Brand: {watch.brand}</p>
                {watch.discount > 0 ? (
                    <>
                        <p className='text-gray-500 line-through text-xs min-h-[1.25rem]'>${watch.price.toFixed(2)}</p>
                        <p className='text-green-600 font-semibold text-sm'>
                            ${(watch.price * (1 - watch.discount / 100)).toFixed(2)}
                            <span className='ml-1 text-[10px] text-red-500'>({watch.discount}% off)</span>
                        </p>
                    </>
                ) : (
                    <>
                        <p className='text-gray-500 line-through text-xs min-h-[1.25rem]'></p>
                        <p className='text-green-600 font-semibold text-sm'>${watch.price.toFixed(2)}</p>
                    </>
                )}
                <button onClick={() => navigate(`/product/${watch.watch_id}`)}
                    className='bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs mt-1 hover:bg-gray-300 transition-colors'>
                    View Details
                </button>
            </div>
        </div>
    )
}

export default WatchCard;