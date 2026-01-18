package com.dianchong.ordersystem.service.impl;

import com.dianchong.ordersystem.dto.RoleResponse;
import com.dianchong.ordersystem.entity.DcRole;
import com.dianchong.ordersystem.mapper.DcRoleMapper;
import com.dianchong.ordersystem.service.RolePermissionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class RolePermissionsServiceImpl implements RolePermissionsService {

    @Autowired
    private DcRoleMapper roleMapper;

    @Override
    public List<RoleResponse> getRoleList(String roleName) {
        List<RoleResponse> roleListResponse = new ArrayList<>();

        List<DcRole> dcRoles = roleMapper.queryByRoleName(roleName);
        if (!CollectionUtils.isEmpty(dcRoles)){
            for (DcRole dcRole : dcRoles) {
                RoleResponse response = new RoleResponse(
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

    @Override
    public RoleResponse edRoleStatus(BigDecimal roleId, Boolean status) {
        roleMapper.updateRoleStatusById(roleId, status);

        DcRole dcRole = roleMapper.queryByRoleId(roleId);

        return new RoleResponse(
                dcRole.getRoleId(),
                dcRole.getRoleName(),
                dcRole.getRemark(),
                dcRole.getCreateTime(),
                dcRole.getUpdateTime(),
                dcRole.getStatus()
        );
    }
}
