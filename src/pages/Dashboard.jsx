import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../store/authSlice.js";
import { setExpenses, addExpenseState, deleteExpenseState, updateExpenseState } from "../../store/expenseSlice.js";
import axios from "../api/axios.js";
import ExpenseChart from "./ExpenseChart.jsx";

export default function Dashboard() {
    // Form & Basic State
    const [newExpense, setNewExpense] = useState({ title: "", amount: "", category: "Food", date: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null); 
    
    // Filter & Search states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // AI State
    const [aiAdvice, setAiAdvice] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    // Budget State
    const [budget, setBudget] = useState(50000);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [newBudgetInput, setNewBudgetInput] = useState(50000);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { user } = useSelector((state) => state.auth);
    const { expenses } = useSelector((state) => state.expenses);

    // --- Setup Initial Budget ---
    useEffect(() => {
        if (user?.monthlyBudget) {
            setBudget(user.monthlyBudget);
            setNewBudgetInput(user.monthlyBudget);
        }
    }, [user]);

    // ==========================================
    // 🛡️ THE FIX: SAFETY NET FOR EXPENSES
    // ==========================================
    // This guarantees that safeExpenses is ALWAYS an array, so .reduce() will never crash!
    const safeExpenses = Array.isArray(expenses) ? expenses : [];

    // --- Calculations (Now using safeExpenses!) ---
    const totalSpent = safeExpenses.reduce((total, item) => total + Number(item.amount), 0);
    
    const categoryMap = safeExpenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
        return acc;
    }, {});
    
    const topCategory = Object.keys(categoryMap).length > 0 
        ? Object.keys(categoryMap).reduce((a, b) => categoryMap[a] > categoryMap[b] ? a : b)
        : "N/A";

    // Budget Progress Math
    const safeBudget = budget > 0 ? budget : 1;
    const budgetPercentage = Math.min((totalSpent / safeBudget) * 100, 100);

    // Filter Logic (Now using safeExpenses!)
    const filteredExpenses = safeExpenses.filter((exp) => {
        const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || exp.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // --- Fetch Expenses on Load ---
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await axios.get('/expenses');
                // Note: If your backend sends { success: true, data: [...] }, 
                // you might need to change this to: dispatch(setExpenses(res.data.data));
                dispatch(setExpenses(res.data));
            } catch (error) {
                if (error.response?.status === 401) {
                    dispatch(setLogout());
                    navigate('/login');
                }
            }
        };
        if (user) fetchExpenses();
        else navigate('/login');
    }, [navigate, dispatch, user]);

    // --- Core Functions ---
    const handleAddExpenses = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (editingId) {
                const res = await axios.put(`/expenses/${editingId}`, newExpense);
                dispatch(updateExpenseState(res.data));
                setEditingId(null); 
            } else {
                const res = await axios.post('/expenses', newExpense);
                dispatch(addExpenseState(res.data));
            }
            
            setNewExpense({ title: "", amount: "", category: "Food", date: "" });
        } catch (error) {
            setError(error.response?.data?.message || "Failed to save expense");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (expense) => {
        const formattedDate = expense.date ? new Date(expense.date).toISOString().split('T')[0] : "";
        
        setNewExpense({
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            date: formattedDate
        });
        setEditingId(expense._id); 
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/expenses/${id}`);
            dispatch(deleteExpenseState(id));
        } catch (error) {
            setError("Failed to delete expense");
            console.log(error)
        }
    };

    const handleUpdateBudget = async () => {
        try {
            const res = await axios.put('/auth/budget', { monthlyBudget: Number(newBudgetInput) });
            setBudget(res.data.monthlyBudget);
            setIsEditingBudget(false);
        } catch (error) { 
            console.log(error)
            setError("Failed to update budget");
        }
    };

    const getAiAdvice = async () => {
        setAiLoading(true);
        setAiAdvice("");
        try {
            const res = await axios.get('/ai/advice');
            setAiAdvice(res.data.advice);
        } catch (error) {
             console.log(error)
            setAiAdvice("The AI is taking a quick nap. Please try again later!");
        } finally {
            setAiLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (safeExpenses.length === 0) return alert("No expenses to download!");
        let csvContent = "Title,Amount (INR),Category,Date\n";
        safeExpenses.forEach(exp => {
            const date = exp.date ? new Date(exp.date).toLocaleDateString() : "No date";
            csvContent += `${exp.title},${exp.amount},${exp.category},${date}\n`;
        });
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "My_Expenses_Report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-[calc(100vh-70px)] bg-zinc-950 text-gray-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Welcome Banner & Export Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl backdrop-blur-xl">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Financial Overview</h1>
                        <p className="text-zinc-400 text-sm mt-1">Welcome back, {user?.name}</p>
                    </div>
                    <button onClick={handleExportCSV} className="mt-4 md:mt-0 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-900/20">
                        ⬇️ Download Report
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-center text-sm">{error}</div>
                )}

                {/* Monthly Budget Tracker Section */}
                <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-3xl space-y-4 shadow-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">🎯 Monthly Budget</h2>
                        
                        {!isEditingBudget ? (
                            <button onClick={() => setIsEditingBudget(true)} className="text-zinc-400 hover:text-white text-sm bg-zinc-800/50 px-4 py-2 rounded-xl transition-colors border border-zinc-700">
                                ✏️ Edit Limit
                            </button>
                        ) : (
                            <div className="flex gap-2 w-full sm:w-auto">
                                <input 
                                    type="number" 
                                    value={newBudgetInput}
                                    onChange={(e) => setNewBudgetInput(e.target.value)}
                                    className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500 w-full sm:w-28"
                                />
                                <button onClick={handleUpdateBudget} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">Save</button>
                                <button onClick={() => setIsEditingBudget(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-sm border border-zinc-700 transition-all">Cancel</button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Spent: <span className="text-white font-bold text-base">₹{totalSpent.toFixed(2)}</span></span>
                            <span className="text-zinc-400">Limit: <span className="text-white font-bold text-base">₹{budget.toLocaleString()}</span></span>
                        </div>
                        
                        {/* The Visual Progress Bar */}
                        <div className="w-full bg-zinc-800/80 rounded-full h-5 overflow-hidden border border-zinc-700/50">
                            <div 
                                className={`h-5 transition-all duration-1000 ease-out rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4)]
                                    ${budgetPercentage >= 100 ? 'bg-red-500' : budgetPercentage > 75 ? 'bg-yellow-400' : 'bg-emerald-500'}`}
                                style={{ width: `${budgetPercentage}%` }}
                            ></div>
                        </div>
                        
                        {budgetPercentage >= 100 && (
                            <p className="text-red-400 text-xs font-bold uppercase tracking-wider mt-2 animate-pulse">
                                ⚠️ Warning: You have exceeded your monthly budget!
                            </p>
                        )}
                    </div>
                </div>

                {/* AI Advisor & 3 Metric Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    
                    {/* Glowing AI Box */}
                    <div className="lg:col-span-1 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-5 rounded-3xl shadow-[0_0_20px_rgba(79,70,229,0.15)] flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-indigo-200 mb-2">✨ AI Advisor</h2>
                            <p className="text-indigo-300/80 text-xs mb-4">Get personalized tips based on your data.</p>
                            {aiAdvice && (
                                <div className="bg-black/30 p-3 rounded-xl border border-indigo-500/20 mb-4 max-h-32 overflow-y-auto">
                                    <p className="text-indigo-100 text-xs font-medium leading-relaxed">{aiAdvice}</p>
                                </div>
                            )}
                        </div>
                        <button onClick={getAiAdvice} disabled={aiLoading || safeExpenses.length === 0} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20">
                            {aiLoading ? "Thinking..." : "Analyze Spending"}
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-3xl flex flex-col justify-center">
                            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Top Category</span>
                            <p className="text-3xl font-black text-blue-400 mt-2">{topCategory}</p>
                        </div>
                        <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-3xl flex flex-col justify-center">
                            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Records</span>
                            <p className="text-3xl font-black text-purple-400 mt-2">{safeExpenses.length}</p>
                        </div>
                    </div>
                </div>

                {/* Add Expense Form */}
                <form onSubmit={handleAddExpenses} className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-3xl space-y-4">
                    <h2 className="text-lg font-bold text-white">Add Transaction</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                        <input type="text" value={newExpense.title} placeholder="Title (e.g. Grocery)" required className="md:col-span-2 p-3 bg-zinc-800/50 border border-zinc-700/60 rounded-xl outline-none focus:border-blue-500 text-white text-sm" onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })} />
                        <input type="number" value={newExpense.amount} placeholder="Amount (₹)" required min="1" className="p-3 bg-zinc-800/50 border border-zinc-700/60 rounded-xl outline-none focus:border-blue-500 text-white text-sm" onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
                        <input type="date" value={newExpense.date} required className="p-3 bg-zinc-800/50 border border-zinc-700/60 rounded-xl outline-none focus:border-blue-500 text-gray-200 text-sm" onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} />
                        <select value={newExpense.category} className="p-3 bg-zinc-800/50 border border-zinc-700/60 rounded-xl outline-none focus:border-blue-500 text-gray-200 text-sm" onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Bills">Bills</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl font-bold text-white text-sm transition-all shadow-lg shadow-blue-500/20">
                        {loading ? "Saving..." : editingId ? "💾 Update Transaction" : "+ Save Transaction"}
                    </button>
                </form>

                {/* Chart Visual - Now passing the safe array! */}
                <ExpenseChart expenses={safeExpenses}/>

                {/* Search & Category Filter Section */}
                <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-3xl space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-xl font-bold text-white">Transactions</h2>
                        <input type="text" placeholder="Search by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-64 px-4 py-2 bg-zinc-800/50 border border-zinc-700/60 rounded-xl text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500" />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {["All", "Food", "Transport", "Entertainment", "Bills", "Other"].map((cat) => (
                            <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${ selectedCategory === cat ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800" }`}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3 pt-3">
                        {filteredExpenses.length === 0 ? (
                            <div className="text-center py-10 border border-zinc-800/60 border-dashed rounded-2xl">
                                <p className="text-zinc-500 text-sm">No transactions match your search or filter.</p>
                            </div>
                        ) : (
                            filteredExpenses.map((expense) => (
                                <div key={expense._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-800 p-4 rounded-2xl transition-all">
                                    <div>
                                        <h3 className="font-bold text-white text-base">{expense.title}</h3>
                                        <div className="flex items-center gap-2 text-zinc-400 text-xs mt-1">
                                            <span className="px-2 py-0.5 bg-zinc-700/40 rounded-md text-zinc-300 font-medium">{expense.category}</span>
                                            <span>•</span>
                                            <span>{expense.date ? new Date(expense.date).toLocaleDateString() : 'No date'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-3 pt-3 sm:pt-0 mt-3 sm:mt-0 border-t sm:border-0 border-zinc-800">
                                        <span className="text-lg font-black text-emerald-400 mr-2">₹{Number(expense.amount).toFixed(2)}</span>
                                        <button onClick={() => handleEditClick(expense)} className="px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(expense._id)} className="px-3 py-1 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}