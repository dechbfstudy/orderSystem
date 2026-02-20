import axios from 'axios';
import {clearStorage, getAccessToken, getRefreshToken, isRememberMe, setTokens} from "./storage.js";
import {message} from "antd";

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
        console.log('请求拦截器token：', token)
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        console.error('请求拦截器错误:', error);
        message.error('请求配置错误');
        return Promise.reject(error);
    }
);

// === 响应拦截器 ===
service.interceptors.response.use(
    (response) => {
        console.log(response)
        return response.data
    },
    async (error) => {
        console.log('响应拦截器错误：', "YES")
        console.log('响应拦截器错误error：', error)
        const originalRequest = error.config;

        console.log('响应拦截器错误originalRequest：', originalRequest)

        // 如果没有响应或者不是401错误，直接reject
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // 检查是否已经重试过最大次数
        originalRequest._retryCount = originalRequest._retryCount || 0;
        console.log('响应拦截器错误originalRequest._retryCount：', originalRequest._retryCount)
        if (originalRequest._retryCount >= MAX_RETRY_COUNT) {
            message.error("请求失败，请退出登录后重试");
            return Promise.reject(error);
        }

        // 如果正在刷新token，则将请求加入队列等待
        console.log('响应拦截器错误isRefreshing：', isRefreshing)
        if (isRefreshing) {
            return new Promise((resolve) => {
                requestsQueue.push((newToken) => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                    resolve(service(originalRequest));
                });
            });
        }

        // 开始刷新token流程
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

            // 处理队列中的请求
            requestsQueue.forEach((cb) => cb(data.accessToken));
            requestsQueue = [];

            // 重新发送原始请求
            originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
            return service(originalRequest);

        } catch (refreshError) {
            // 刷新失败，清空队列并跳转到登录页
            requestsQueue = [];
            clearStorage();
            const currentPath = window.location.pathname;
            if (currentPath !== '/login') {
                window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);


export default service;