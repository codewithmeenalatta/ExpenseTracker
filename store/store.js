import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import expenseReducer from './expenseSlice.js';
export const store = configureStore({
    reducer : {
        auth : authReducer,
        expenses : expenseReducer
    },
});