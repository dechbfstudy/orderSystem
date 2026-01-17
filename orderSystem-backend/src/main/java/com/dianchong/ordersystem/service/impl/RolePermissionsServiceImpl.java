package com.dianchong.ordersystem.service.impl;

import com.dianchong.ordersystem.dto.RoleListResponse;
import com.dianchong.ordersystem.entity.DcRole;
import com.dianchong.ordersystem.mapper.DcRoleMapper;
import com.dianchong.ordersystem.service.RolePermissionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class RolePermissionsServiceImpl implements RolePermissionsService {

    @Autowired
    private DcRoleMapper roleMapper;

    @Override
    public List<RoleListResponse> getRoleList(String roleName) {
        List<RoleListResponse> roleListResponse = new ArrayList<>();

        List<DcRole> dcRoles = roleMapper.queryByRoleName(roleName);
        if (!CollectionUtils.isEmpty(dcRoles)){
            for (DcRole dcRole : dcRoles) {
                RoleListResponse response = new RoleListResponse(
                        dcRole.getRoleId(),
                        dcRole.getRoleName(),
                        dcRole.getRemark(),
                        dcRole.getCreateTime(),
                        dcRole.getUpdateTime(),
                        dcRole.getStatus()
                );
                roleListResponse.add(response);
            }
            return roleListResponse;
        }

        return roleListResponse;
    }
}
