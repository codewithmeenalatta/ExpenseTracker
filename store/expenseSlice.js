import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
    name: "expenses",
    initialState: {
        expenses: [],
    },
    reducers: {
        setExpenses: (state, action) => {
            state.expenses = action.payload;
        },
        addExpenseState: (state, action) => {
            state.expenses.push(action.payload);
        },
        deleteExpenseState: (state, action) => {
            state.expenses = state.expenses.filter((exp) => exp._id !== action.payload);
        },
        // NEW: This finds the old expense and replaces it with the new edited one
        updateExpenseState: (state, action) => {
            const index = state.expenses.findIndex(exp => exp._id === action.payload._id);
            if (index !== -1) {
                state.expenses[index] = action.payload;
            }
        }
    }
});

// Make sure to export the new update function here at the bottom!
export const { setExpenses, addExpenseState, deleteExpenseState, updateExpenseState } = expenseSlice.actions;
export default expenseSlice.reducer;