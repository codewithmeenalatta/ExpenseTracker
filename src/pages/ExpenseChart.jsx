import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function ExpenseChart({ expenses }) {
    // If there are no expenses, don't show the chart
    if (!expenses || expenses.length === 0) return null;

    // 1. Group the math: Add up all the money spent in each category
    const categoryData = expenses.reduce((acc, curr) => {
        const existing = acc.find(item => item.name === curr.category);
        if (existing) {
            existing.value += Number(curr.amount);
        } else {
            acc.push({ name: curr.category, value: Number(curr.amount) });
        }
        return acc;
    }, []);

    // 2. Premium glowing colors for the chart
    const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

    return (
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-3xl mt-2 mb-6 shadow-xl backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6">Spending Analytics</h2>
            
            {/* 3. The Responsive Container makes the chart resize perfectly on mobile! */}
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80} // Makes it a Donut instead of a solid Pie
                            outerRadius={110}
                            paddingAngle={5} // Adds beautiful gaps between slices
                            dataKey="value"
                            stroke="none"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        
                        {/* A dark-themed tooltip when you hover over the chart */}
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                            itemStyle={{ color: '#e4e4e7', fontWeight: 'bold' }}
                            formatter={(value) => `₹${value.toFixed(2)}`}
                        />
                        
                        {/* Shows which color is which category at the bottom */}
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}