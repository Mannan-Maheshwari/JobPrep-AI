import React from 'react'
import { useNavigate, Link } from 'react-router';

const Register = () => {

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic here
    }

  return (
    <main className="screen bg-zinc-800 text-white flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mt-10 p-8 space-y-4 bg-zinc-900 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold ">
                Register
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">  
                    <label htmlFor="Username" className="block text-sm font-medium text-white">
                        Username
                    </label>
                    <input
                        type="text"
                        id="Username"
                        name="Username"
                        placeholder="Enter username"
                        className="bg-white p-2 text-black placeholder:text-gray-700 mt-2 rounded-xl border border-gray-600 h-10 w-full focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>
                <div className="mb-4">  
                    <label htmlFor="email" className="block text-sm font-medium text-white">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter email address"
                        className="bg-white p-2 text-black placeholder:text-gray-700 mt-2 rounded-xl border border-gray-600 h-10 w-full focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-white">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter password"
                        className="bg-white text-black placeholder:text-gray-700 mt-2 rounded-xl border border-gray-600 h-10 w-full focus:ring-blue-500 focus:border-blue-500 p-2"
                    />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-[scale_110] duration-300 ease-in-out ">
                    Register
                </button>
            </form>

            <p className="text-sm text-gray-400 mt-4">
                Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
            </p>
        </div>
    </main>
  )
}

export default Register