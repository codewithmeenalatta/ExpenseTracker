import axios from "axios";

const instance = axios.create({
    // This tells Vite to read the VITE_API_URI from your .env file
    baseURL: import.meta.env.VITE_API_URI,
    withCredentials: true,
});

export default instance;