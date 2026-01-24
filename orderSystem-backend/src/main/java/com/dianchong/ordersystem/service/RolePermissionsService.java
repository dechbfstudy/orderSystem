package com.dianchong.ordersystem.service;

import com.dianchong.ordersystem.dto.PermissionTreeResponse;
import com.dianchong.ordersystem.dto.RoleRequest;
import com.dianchong.ordersystem.dto.RoleResponse;

import java.math.BigDecimal;
import java.util.List;

public interface RolePermissionsService {
    List<RoleResponse> getRoleList(String roleName, Boolean status);

    RoleResponse edRoleStatus(BigDecimal roleId, Boolean status);

    List<PermissionTreeResponse> getPermissionTree();

    void createRole(RoleRequest roleRequest);

    void updateRole(RoleRequest roleRequest);
}
