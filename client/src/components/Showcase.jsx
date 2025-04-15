import { useNavigate } from 'react-router-dom';
import WatchCard from './WatchCard';

function Showcase({ watches }) {
    const navigate = useNavigate();
    return (
        <div className='container mx-auto p-6'>
            <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6'>
                {watches.filter(w => w.stock > 0).map(watch => (
                    <WatchCard key={watch.watch_id} watch={watch} navigate={navigate} />
                ))}
            </div>
        </div>
    );
}

export default Showcase;