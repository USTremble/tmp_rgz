import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:5252/api',
    withCredentials: true 
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (window.location.pathname !== '/login') {
                localStorage.removeItem('isLoggedIn');
                toast.error("Сессия истекла");
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

export default api;