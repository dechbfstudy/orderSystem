package com.dianchong.ordersystem.controller;

import com.dianchong.ordersystem.common.ApiResponse;
import com.dianchong.ordersystem.dto.EdRoleRequest;
import com.dianchong.ordersystem.dto.PermissionTreeResponse;
import com.dianchong.ordersystem.dto.RoleRequest;
import com.dianchong.ordersystem.dto.RoleResponse;
import com.dianchong.ordersystem.service.RolePermissionsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/system/role-permissions")
public class RolePermissionsController {

    @Autowired
    private RolePermissionsService rolePermissionsService;

    @GetMapping("/list")
    public ApiResponse<List<RoleResponse>> getRoleList(@RequestParam(value = "roleName", required = false) String roleName,
                                                       @RequestParam(value = "status", required = false) Boolean status){
        List<RoleResponse> roleListResponse = rolePermissionsService.getRoleList(roleName, status);
        return ApiResponse.success(roleListResponse);
    }

    @GetMapping("/permission-tree")
    public ApiResponse<List<PermissionTreeResponse>> getPermissionTree(){
        List<PermissionTreeResponse> permissionTree = rolePermissionsService.getPermissionTree();
        return ApiResponse.success(permissionTree);
    }

    @PostMapping("/ed-role")
    public ApiResponse<RoleResponse> EDRole(@Valid @RequestBody EdRoleRequest edRoleRequest){
        RoleResponse editRoleResponse = rolePermissionsService.edRoleStatus(edRoleRequest.getRoleId(), edRoleRequest.getStatus());
        return ApiResponse.success(editRoleResponse);
    }

    @PostMapping("/create")
    public ApiResponse<String> createRole(@Valid @RequestBody RoleRequest roleRequest){
        rolePermissionsService.createRole(roleRequest);
        return ApiResponse.success();
    }

    @PostMapping("/edit")
    public ApiResponse<String> editRole(@Valid @RequestBody RoleRequest roleRequest){
        rolePermissionsService.updateRole(roleRequest);
        return ApiResponse.success();
    }
}
