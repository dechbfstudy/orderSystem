package com.dianchong.ordersystem.service;

import com.dianchong.ordersystem.dto.RoleResponse;

import java.math.BigDecimal;
import java.util.List;

public interface RolePermissionsService {
    List<RoleResponse> getRoleList(String roleName);

    RoleResponse edRoleStatus(BigDecimal roleId, Boolean status);
}
