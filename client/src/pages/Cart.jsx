import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartWatchCard from '../components/CartWatchCard';

function Cart() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const [itemList, setItemList] = useState([]);
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchWatch = async (id) => {
        const response = await fetch(`${apiUrl}/product/${id}`);
        const data = await response.json();
        return data.watch;
    }

    useEffect(() => {
        const loadData = async () => {
            let cartItems = [];
            if (user) {
                try {
                    const response = await fetch(`${apiUrl}/cart`, {
                        credentials: 'include'
                    });
                    const data = await response.json();
                    if (data.status === 'success') {
                        cartItems = data.data.items;
                    }
                } catch (error) {
                    console.error('Fetch failed:', error);
                }
            } else {
                cartItems = cart;
            }
            try {
                const watchPromises = Object.values(cartItems).map(item => fetchWatch(item.product));
                const details = await Promise.all(watchPromises);
                const combined = cartItems.map((item, index) => ({
                    product: details[index],
                    quantity: item.quantity
                }));
                setItemList(combined);
                console.log(itemList);
            } catch (error) {
                console.error(error);
            }
        };
        loadData();
    }, [user, cart]);

    return (
        <div className='flex flex-col my-16'>
            <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-4 ml-2 sm:ml-4'>
                Cart
            </h1>
            {itemList.map((item) => (
                <CartWatchCard key={item.product.watch_id} watch={item.product} quantity={item.quantity} navigate={navigate} />
            ))}
        </div>
    );
}

export { Cart };