const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_INFO_KEY = 'userInfo';

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
 * 保存用户信息
 * @param {Object} userObj 用户对象 { nickname: '张三', username: 'admin' }
 * @param {boolean} rememberMe 是否记住我
 */
export function setUserInfo(userObj, rememberMe) {
    const userStr = JSON.stringify(userObj); // 转成字符串存储
    if (rememberMe) {
        localStorage.setItem(USER_INFO_KEY, userStr);
        sessionStorage.removeItem(USER_INFO_KEY);
    } else {
        sessionStorage.setItem(USER_INFO_KEY, userStr);
        localStorage.removeItem(USER_INFO_KEY);
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
 * 获取用户信息
 * @returns {Object|null} 返回对象或 null
 */
export function getUserInfo() {
    const userStr = localStorage.getItem(USER_INFO_KEY) || sessionStorage.getItem(USER_INFO_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * 清除所有 Token (登出时调用)
 */
export function clearStorage() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);

    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_INFO_KEY);
}