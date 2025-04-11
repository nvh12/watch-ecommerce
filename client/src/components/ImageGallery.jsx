import { useEffect, useState } from "react";

function ImageGallery({ imageURLs = [], name }) {
    const [validImages, setValidImages] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const validate = async () => {
            const checks = await Promise.all(
                imageURLs.map(url => 
                    new Promise(resolve => {
                        const img = new Image();
                        img.src = url;
                        img.onload = () => resolve(url);
                        img.onerror = () => resolve(null);
                    })
                )
            );
            setValidImages(checks.filter(Boolean));
        };
        if (imageURLs.length > 0) {
            validate();
        }
    }, [imageURLs]);

    const handleNext = () => {
        setIndex((prev) => (prev + 1) % validImages.length);
    }

    const handlePrev = () => {
        setIndex((prev) => (prev - 1) % validImages.length);
    }

    return (
        <div className='flex flex-col items-center'>
            <img
                src={validImages[index]}
                alt={name}
                className='w-64 h-auto object-cover'
            />
            {validImages.length > 1 && (
                <div className='mt-2 flex gap-3'>
                    <button onClick={handlePrev} className='px-2 py-1 bg-gray-300 rounded'>Prev</button>
                    <button onClick={handleNext} className='px-2 py-1 bg-gray-300 rounded'>Next</button>
                </div>
            )}
        </div>
    )
}

export default ImageGallery;