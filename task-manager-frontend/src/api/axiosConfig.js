import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // Crucial for sending/receiving the HttpOnly refresh token cookie
    headers: {
        'Content-Type': 'application/json'
    }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Will attach token dynamically to requests from auth state (done inside App/Context typically, 
// but we can inject it here if we expose a setter)
export const setupAxiosInterceptors = (getToken, updateToken, logout) => {
    api.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/refresh') {
                if (isRefreshing) {
                    return new Promise(function(resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return api(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const res = await api.post('/auth/refresh');
                    const newToken = res.data.token;
                    updateToken(newToken);
                    processQueue(null, newToken);
                    
                    originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    logout();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );
};

export default api;
