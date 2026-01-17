// src/utils/storage.js

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * 判断当前是否处于“记住我”状态
 * 逻辑：如果 RefreshToken 存在于 localStorage，说明之前选了记住我
 */
export function isRememberMe() {
    return !!localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * 保存 Token
 * @param {string} accessToken
 * @param {string} refreshToken
 * @param {boolean} rememberMe - true: 存 local(持久), false: 存 session(临时)
 */
export function setTokens(accessToken, refreshToken, rememberMe) {
    if (rememberMe) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        // 清理 session 以免混乱
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    } else {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        // 清理 local
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
}

/**
 * 获取 AccessToken (优先找 session，再找 local)
 */
export function getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * 获取 RefreshToken
 */
export function getRefreshToken() {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * 清除所有 Token (登出时调用)
 */
export function clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}