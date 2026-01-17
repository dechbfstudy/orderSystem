package com.dianchong.ordersystem.controller;

import com.dianchong.ordersystem.dto.RoleListResponse;
import com.dianchong.ordersystem.service.RolePermissionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/system/role-permissions")
public class RolePermissionsController {

    @Autowired
    private RolePermissionsService rolePermissionsService;

    @GetMapping("/list")
    public ResponseEntity<List<RoleListResponse>> getRoleList(@RequestParam(value = "roleName", required = false) String roleName){
        List<RoleListResponse> roleListResponse = rolePermissionsService.getRoleList(roleName);
        return ResponseEntity.ok(roleListResponse);
    }
}
