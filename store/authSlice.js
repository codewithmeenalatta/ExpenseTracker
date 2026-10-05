import { createSlice } from "@reduxjs/toolkit";

// 1. Safely check browser memory without crashing
let user = null;
try {
    const storedData = localStorage.getItem('user');
    
    // Only try to read the data if it actually exists AND is not the word "undefined"
    if (storedData && storedData !== "undefined") {
        user = JSON.parse(storedData);
    } else {
        // If it is bad data, delete it immediately
        localStorage.removeItem('user');
    }
} catch (error) {
    // If anything goes wrong, just start with no user
    localStorage.removeItem('user');
}

const initialState = {
    user: user,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        setLogout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        }
    }
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;