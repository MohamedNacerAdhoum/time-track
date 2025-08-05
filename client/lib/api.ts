import axios from "axios";

type TokenGetter = () => string | undefined;

// This will be set by the application during initialization
let tokenGetter: TokenGetter = () => undefined;

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Get token using the provided getter function
        const token = tokenGetter();
        if (token) {
            // Try both common token formats
            config.headers.Authorization = `Token ${token}`;  // Django default
            config.headers['X-CSRFToken'] = token;  // For CSRF protection
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Format error for better readability
            error.message = `API Error (${error.response.status}): ${error.response.statusText}`;
            if (error.response.data) {
                error.responseData = error.response.data;
            }

            if (error.response.status === 403) {
                console.error('Access denied. Possible issues:');
                console.error('- Invalid or expired token');
                console.error('- Missing CSRF token');
                console.error('- Insufficient permissions');
            }
        }
        return Promise.reject(error);
    }
);

// Function to set the token getter after store is initialized
export const setTokenGetter = (getter: TokenGetter) => {
    tokenGetter = getter;
};

export default api;