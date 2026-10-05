import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../store/authSlice.js";
import axios from "../api/axios";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        
        try {
            const response = await axios.post('/auth/login', formData);
            
            // 1. Save user to Redux
            dispatch(setLogin(response.data.user)); 
            
            // 2. Redirect to dashboard
            navigate('/');
        } catch (err) {
            // Display inline error instead of alert
            setError(err.response?.data?.message || "Login Failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-70px)] bg-zinc-900 text-gray-100">
            <div className="w-full max-w-md p-8 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-zinc-400 text-sm">Enter your credentials to access your account</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            type="email"
                            placeholder="Email address"
                            required
                            className="w-full p-3.5 bg-zinc-900/50 border border-zinc-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-zinc-500"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            // FIXED BUG: Changed 'email' to 'password'
                            className="w-full p-3.5 bg-zinc-900/50 border border-zinc-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-zinc-500"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full p-3.5 mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200"
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <p className="mt-6 text-center text-zinc-400 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}