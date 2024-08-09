import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000',  // Your Flask backend URL
    withCredentials: true,  // This ensures that session cookies are sent with requests
});

export default instance;
