package com.dianchong.ordersystem.controller;

import com.dianchong.ordersystem.dto.EdRoleRequest;
import com.dianchong.ordersystem.dto.RoleResponse;
import com.dianchong.ordersystem.service.RolePermissionsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/system/role-permissions")
public class RolePermissionsController {

    @Autowired
    private RolePermissionsService rolePermissionsService;

    @GetMapping("/list")
    public ResponseEntity<List<RoleResponse>> getRoleList(@RequestParam(value = "roleName", required = false) String roleName){
        List<RoleResponse> roleListResponse = rolePermissionsService.getRoleList(roleName);
        return ResponseEntity.ok(roleListResponse);
    }

    @PostMapping("/ed-role")
    public ResponseEntity<RoleResponse> EDRole(@Valid @RequestBody EdRoleRequest edRoleRequest){
        RoleResponse editRoleResponse = rolePermissionsService.edRoleStatus(edRoleRequest.getRoleId(), edRoleRequest.getStatus());
        return ResponseEntity.ok(editRoleResponse);
    }

    @PostMapping("/credit")
    public ResponseEntity<Boolean> createRole(){
        return null;
    }

    @PostMapping("/edit")
    public ResponseEntity<Boolean> editRole(){
        return null;
    }
}
