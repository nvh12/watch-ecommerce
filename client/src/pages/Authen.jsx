import { useEffect, useState } from "react";

function Register() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        password2: ''
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.password !== formData.password2) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
            } else {
                alert('Cannot send form');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit.');
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-6">
                {['email', 'username', 'password', 'password2'].map((field, index) => (
                    <div key={index}>
                        <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                            {field === 'password2' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}:
                        </label>
                        <input
                            type={field.includes('password') ? 'password' : 'text'}
                            id={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                ))}
                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Sign up</button>
                </div>
            </form>
        </div>
    );
}

function Login() {
    return (
        <div className="flex justify-center items-center bg-gray-100">
            <form className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-6">
                <div>
                    <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">Email or Username:</label>
                    <input type="text" id="identifier" name="identifier" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                    <input type="password" id="password" name="password" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Sign in</button>
                </div>
            </form>
        </div>
    )
}

export { Register, Login }