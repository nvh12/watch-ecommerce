function Showcase({ watches }) {
    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
                {watches.map((watch) => (
                    <div key={watch._id} className="border p-4 shadow-lg rounded-lg text-center flex flex-col justify-between">
                        <div>
                            <img src={watch.image_url[0]} alt={watch.name} className="w-full h-48 object-cover rounded-md" />
                            <h3 className="text-xl font-semibold mt-2">{watch.name}</h3>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-gray-500">Brand: {watch.brand}</p>
                            <p className="text-green-600 font-bold">Price: ${watch.price}</p>
                            <p className={`mt-2 ${watch.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                                {watch.stock > 0 ? `In Stock: ${watch.stock}` : "Out of Stock"}
                            </p>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Showcase;