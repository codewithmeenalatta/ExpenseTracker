import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "../api/axios.js";
import { addExpenseState } from "../../store/expenseSlice.js";
import instance from "../api/axios.js";

export default function ExpenseForm() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "Food", // Default category
        date: "",
        description: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Send the new expense to your MongoDB database
            const response = await instance.post('/expenses', formData);
            
            // 2. Immediately update Redux so it shows on screen without refreshing!
            dispatch(addExpenseState(response.data));

            // 3. Clear the form so they can add another one
            setFormData({ title: "", amount: "", category: "Food", date: "", description: "" });
        } catch (error) {
            console.error("Failed to add expense", error);
            alert("Failed to add expense. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Expense</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-zinc-400 text-sm mb-1 block">Title</label>
                    <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g., Starbuck Coffee"
                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-blue-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-zinc-400 text-sm mb-1 block">Amount (₹)</label>
                        <input type="number" name="amount" required value={formData.amount} onChange={handleChange} placeholder="0.00"
                            className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="text-zinc-400 text-sm mb-1 block">Date</label>
                        <input type="date" name="date" required value={formData.date} onChange={handleChange} 
                            className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-blue-500" />
                    </div>
                </div>

                <div>
                    <label className="text-zinc-400 text-sm mb-1 block">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} 
                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-blue-500">
                        <option value="Food">Food & Dining</option>
                        <option value="Transport">Transportation</option>
                        <option value="Rent">Rent & Bills</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="text-zinc-400 text-sm mb-1 block">Description (Optional)</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Add a quick note..." rows="2"
                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-blue-500"></textarea>
                </div>

                <button type="submit" disabled={loading} 
                    className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all">
                    {loading ? "Saving..." : "+ Add Expense"}
                </button>
            </form>
        </div>
    );
}