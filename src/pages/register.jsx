import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios.js";
import { User, Mail, Lock, AlertCircle } from "lucide-react";

// FIXED: Changed "oonst" to "const"
const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Failed to register. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4">
            <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
                <p className="text-zinc-400 text-center mb-8">Start tracking your expenses today</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-500">
                        <AlertCircle size={20} />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 text-zinc-500" size={20} />
                        <input 
                            type="text" 
                            name="name"
                            required
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-zinc-500" size={20} />
                        <input 
                            type="email" 
                            name="email"
                            required
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-zinc-500" size={20} />
                        <input 
                            type="password" 
                            name="password"
                            required
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-zinc-400 mt-6 text-sm">
                    Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">Log in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;