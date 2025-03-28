import { FaUser, FaCartShopping } from 'react-icons/fa6'

function CartandLoginButtons({ className = '' }) {
    return (
        <div className={`${className} flex items-center gap-2`}>
            <button className="p-2 bg-gray-700 hover:bg-blue-500 rounded-full">
                <FaCartShopping />
            </button>
            <button className="p-2 bg-gray-700 hover:bg-blue-500 rounded-full">
                <FaUser />
            </button>
        </div>
    )
}

export default CartandLoginButtons;