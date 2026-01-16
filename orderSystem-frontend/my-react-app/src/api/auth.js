

// 定义接口路径
import request from "../utils/request.js";

const API_URL = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout', // 如果你有做后端登出
    USER_INFO: '/user/info' // 示例业务接口
};

/**
 * 用户登录
 * @param {Object} data { username, password }
 */
export function login(data) {
    return request({
        url: API_URL.LOGIN,
        method: 'post',
        data
    });
}

/**
 * 获取用户信息 (会自动带 Token)
 */
export function getUserInfo() {
    return request({
        url: API_URL.USER_INFO,
        method: 'get'
    });
}

/**
 * 登出 (清除本地缓存)
 * 建议在组件里调用这个后，手动清除 localStorage 并跳转
 */
export function logout() {
    // 仅作演示，如果后端没登出接口，前端直接清缓存即可
    // return request({ url: API_URL.LOGOUT, method: 'post' });
    return Promise.resolve();
}