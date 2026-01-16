import axios from 'axios';

// 1. 创建 axios 实例
const service = axios.create({
    // 你的后端地址，开发环境建议在 package.json 或 vite.config.js 配置 proxy
    // 这里写死或者读取环境变量
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
});

// 定义常量 key，方便统一管理
export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

// 是否正在刷新的标记
let isRefreshing = false;
// 请求等待队列
let requestsQueue = [];

// =================================================================================
// 2. 请求拦截器：每次请求前自动带上 AccessToken
// =================================================================================
service.interceptors.request.use(
    (config) => {
        // 排除登录和刷新接口，防止死循环 (虽然逻辑上不会进，但加一层保险)
        if (config.url.includes('/auth/login') || config.url.includes('/auth/refresh')) {
            return config;
        }

        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
            // 这里的 'Bearer ' 注意后面有个空格
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// =================================================================================
// 3. 响应拦截器：处理 Token 过期并发刷新
// =================================================================================
service.interceptors.response.use(
    (response) => {
        // 如果后端统一封装了 { code: 200, data: ... }，可以在这里解包
        // 这里假设直接返回 response.data 更方便
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // 如果没有 response，可能是网络断了
        if (!error.response) {
            return Promise.reject(error);
        }

        const { status } = error.response;

        // -----------------------------------------------------------
        // 核心逻辑：拦截 401 (Unauthorized) 且该请求未重试过
        // -----------------------------------------------------------
        if (status === 401 && !originalRequest._retry) {

            // 如果当前已经有其他请求在刷新 Token 了
            if (isRefreshing) {
                // 将当前请求挂起，放入队列
                return new Promise((resolve) => {
                    requestsQueue.push((newToken) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                        resolve(service(originalRequest)); // 重新执行原请求
                    });
                });
            }

            // 如果我是第一个发现过期的请求
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // 调用刷新接口 (注意：这里直接用 axios 原始实例，避免走拦截器死循环)
                const { data } = await axios.post(
                    (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/auth/refresh',
                    { refreshToken }
                );

                // 假设后端返回结构是: { accessToken: '...', refreshToken: '...' }
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;

                // 1. 更新本地存储
                localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
                // Strategy B: 后端每次也返回新的 RefreshToken，所以也要更新
                if (newRefreshToken) {
                    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
                }

                // 2. 执行队列中的等待请求
                requestsQueue.forEach((callback) => callback(newAccessToken));
                requestsQueue = []; // 清空队列

                // 3. 重试当前请求
                originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
                return service(originalRequest);

            } catch (refreshError) {
                // 刷新失败（Refresh Token 过期、被废除、或网络错误）
                requestsQueue = [];
                localStorage.removeItem(ACCESS_TOKEN_KEY);
                localStorage.removeItem(REFRESH_TOKEN_KEY);

                // 强制跳转登录页 (带上当前页面的 redirect 参数体验更好)
                // 注意：在 React Router 中通常不能在这里直接用 hook，用 window.location 最稳
                const currentPath = window.location.pathname;
                if (currentPath !== '/login') {
                    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // 处理 403 (无权限 / 账号禁用)
        if (status === 403) {
            console.error('权限不足或账号已禁用');
            // 可以结合 UI 库弹出提示，例如 message.error('权限不足')
        }

        return Promise.reject(error);
    }
);

export default service;