package com.dianchong.ordersystem.service;

import com.dianchong.ordersystem.dto.RoleListResponse;

import java.util.List;

public interface RolePermissionsService {
    List<RoleListResponse> getRoleList(String roleName);
}
