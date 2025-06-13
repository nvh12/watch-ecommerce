import { useNavigate } from 'react-router-dom';

function OrderCard({ order, role }) {
    const navigate = useNavigate();
    const itemQuantity = order.items.reduce((total, item) => total + item.quantity, 0);
    return (
        <div
            key={order._id}
            className='rounded-lg p-4 bg-neutral-50 shadow-sm flex flex-row justify-between gap-4 items-start sm:items-center transform transition-transform duration-300 ease-in-out hover:scale-101 hover:-translate-y-1 hover:shadow-md'>
            <div className='flex flex-col gap-1'>
                <p className='text-sm text-gray-500'>{new Date(order.createdAt).toLocaleString()}</p>
                <p className='font-medium text-gray-800'>{itemQuantity} item{itemQuantity !== 1 ? 's' : ''}</p>
                <p className='text-sm text-gray-700'>Total: <span className='font-semibold text-green-600'>${order.total_price.toFixed(2)}</span></p>
                <p className='text-sm text-gray-700 capitalize'>Payment: {order.payment}</p>
                <p className='text-sm text-gray-700 capitalize'>Delivery: {order.delivery}</p>
                {order.delivery === 'delivery' && (
                    <p className='text-sm text-gray-500 truncate'>To: {order.address}</p>
                )}
            </div>
            <div className='flex items-start sm:items-center justify-end sm:flex-col sm:justify-center sm:text-right'>
                <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'}`}
                >
                    {order.status}
                </span>
                <button
                    onClick={() => navigate(`/${role}/order/${order._id}`)}
                    className='mt-9 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300 transition-colors'
                >View Details</button>
            </div>
        </div>
    )
}

export default OrderCard;