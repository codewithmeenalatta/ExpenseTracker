import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Bring in our logout tool from Redux
import { setLogout } from "../../store/authSlice.js";

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Ask Redux if someone is logged in
    const { user } = useSelector((state) => state.auth);

    // This function runs when they click Logout
    const handleLogout = () => {
        dispatch(setLogout()); // 1. Erase user data from browser
        navigate('/login');    // 2. Send them to the login page
    };

    return (
        <nav className="bg-zinc-900/50 border-b border-zinc-800 p-4 sticky top-0 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                {/* Logo / App Name */}
                <Link to="/" className="text-white text-2xl font-bold tracking-wider">
                    ExpenseTracker
                </Link>

                {/* If user is logged in, show their name and Logout button. 
                    If not, show Login/Register buttons. */}
                {user ? (
                    <div className="flex items-center gap-6">
                        <span className="text-zinc-400 font-medium">
                            Hello, <span className="text-white">{user.name}</span>
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 px-5 py-2 rounded-xl font-semibold transition-all"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login" className="text-zinc-400 hover:text-white px-4 py-2 font-semibold transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-semibold transition-all">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}