import axios from 'axios';
import {clearStorage, getAccessToken, getRefreshToken, isRememberMe, setTokens} from "./storage.js";

const service = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

const MAX_RETRY_COUNT = 3;
let isRefreshing = false;
let requestsQueue = [];

// === 请求拦截器 ===
service.interceptors.request.use(
    (config) => {
        // 排除登录注册接口
        if (config.url.includes('/auth/login') || config.url.includes('/auth/refresh')) {
            return config;
        }
        // 使用工具类获取 Token
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// === 响应拦截器 ===
service.interceptors.response.use(
    (response) =>
        response.data
    ,
    async (error) => {
        console.log('响应拦截器错误：', "YES")
        console.log('响应拦截器错误error：', error)
        const originalRequest = error.config;

        console.log('响应拦截器错误originalRequest：', originalRequest)

        if (!error.response) return Promise.reject(error);

        originalRequest._retryCount = originalRequest._retryCount || 0;
        if (originalRequest._retryCount >= MAX_RETRY_COUNT) {
            return Promise.reject(error);
        }
        if (isRefreshing) {
            return new Promise((resolve) => {
                requestsQueue.push((newToken) => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                    resolve(service(originalRequest));
                });
            });
        }

        originalRequest._retryCount += 1;
        isRefreshing = true;

        try {
            // 使用工具类获取 RefreshToken
            const refreshToken = getRefreshToken();

            if (!refreshToken) throw new Error('No refresh token');

            // 调用刷新接口
            const { data } = await axios.post(
                'http://localhost:8080/auth/refresh',
                { refreshToken }
            );

            // 刷新成功后，判断应该存哪里
            // 如果旧的 RefreshToken 在 localStorage 里，说明用户之前选了记住我，新 Token 也要存那里
            const remember = isRememberMe();

            // 保存新 Token
            setTokens(data.accessToken, data.refreshToken, remember);

            requestsQueue.forEach((cb) => cb(data.accessToken));
            requestsQueue = [];

            originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
            return service(originalRequest);

        } catch (refreshError) {
            requestsQueue = [];
            // 清除所有 Token
            clearStorage();
            const currentPath = window.location.pathname;
            if (currentPath !== '/login') {
                window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }

        return Promise.reject(error);
    }
);


export default service;