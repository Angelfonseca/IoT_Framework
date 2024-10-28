import axios, { InternalAxiosRequestConfig } from 'axios';

const url = 'http://localhost:3000'; // Remove trailing slash
// const url = 'http://10.10.49.166:5000';
const api = axios.create({
    baseURL: `${url}/api` // Add the slash here
});

// Interceptor to add the authorization token if available
api.interceptors.request.use(
    function (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
        const token = localStorage.getItem('token'); // Get only the token
        if (token) {
            config.headers.set('Authorization', `${token}`); // Add the token in the correct format
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export { api, url };
