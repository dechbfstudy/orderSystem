

// 定义接口路径
import request from "../utils/request.js";
import {data} from "react-router-dom";

const API_URL = {
    LOGIN: '/auth/login',
    ROLE_LIST: '/system/role-permissions/list',
    ED_ROLE: '/system/role-permissions/ed-role',
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
 * 获取角色列表 (会自动带 Token)
 */
export function getRoleList(data) {
    return request({
        url: API_URL.ROLE_LIST,
        method: 'get',
        params: data
    });
}

/**
 * 启用/禁用角色 (会自动带 Token)
 */
export function enableOrDisableRole(data) {
    return request({
        url: API_URL.ED_ROLE,
        method: 'post',
         data
    });
}