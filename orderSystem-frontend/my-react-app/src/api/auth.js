// 定义接口路径
import request from "../utils/request.js";

const API_URL = {
    LOGIN: '/auth/login',
    ROLE_LIST: '/system/role-permissions/list',
    ED_ROLE: '/system/role-permissions/ed-role',
    PERMISSION_TREE: '/system/role-permissions/permission-tree',
    CREATE_ROLE: '/system/role-permissions/credit',
    UPDATE_ROLE: '/system/role-permissions/edit',
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

export function getRoleList(data) {
    return request({
        url: API_URL.ROLE_LIST,
        method: 'get',
        params: data
    });
}

export function enableOrDisableRole(data) {
    return request({
        url: API_URL.ED_ROLE,
        method: 'post',
         data
    });
}

export function getPermissionTree() {
    return request({
        url: API_URL.PERMISSION_TREE,
        method: 'get'
    });
}

export function createRole(data) {
    return request({
        url: API_URL.CREATE_ROLE,
        method: 'post',
        data
    });
}

export function updateRole(data) {
    return request({
        url: API_URL.UPDATE_ROLE,
        method: 'post',
        data
    });
}