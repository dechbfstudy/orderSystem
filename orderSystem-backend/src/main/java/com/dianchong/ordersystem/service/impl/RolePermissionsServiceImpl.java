package com.dianchong.ordersystem.service.impl;

import com.dianchong.ordersystem.common.ResponseMsgStatus;
import com.dianchong.ordersystem.dto.PermissionTreeResponse;
import com.dianchong.ordersystem.dto.RoleDetailResponse;
import com.dianchong.ordersystem.dto.RoleRequest;
import com.dianchong.ordersystem.dto.RoleResponse;
import com.dianchong.ordersystem.entity.DcPermission;
import com.dianchong.ordersystem.entity.DcRole;
import com.dianchong.ordersystem.exception.BusinessException;
import com.dianchong.ordersystem.mapper.DcPermissionMapper;
import com.dianchong.ordersystem.mapper.DcRoleMapper;
import com.dianchong.ordersystem.mapper.DcRolePermissionMapper;
import com.dianchong.ordersystem.service.RolePermissionsService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
public class RolePermissionsServiceImpl implements RolePermissionsService {

    @Autowired
    private DcRoleMapper roleMapper;

    @Autowired
    private DcPermissionMapper permissionMapper;

    @Autowired
    private DcRolePermissionMapper rolePermissionMapper;

    @Override
    public List<RoleResponse> getRoleList(String roleName, Boolean status) {
        List<RoleResponse> roleListResponse = new ArrayList<>();

        List<DcRole> dcRoles = roleMapper.queryByConcatRoleNameAndStatus(roleName, status);

        if (!CollectionUtils.isEmpty(dcRoles)){
            for (DcRole dcRole : dcRoles) {
                List<BigDecimal> permissionIds = rolePermissionMapper.queryLeafPermissionIdsByRoleId(dcRole.getRoleId());
                RoleResponse response = new RoleResponse(
                        dcRole.getRoleId(),
                        dcRole.getHighlightColor(),
                        dcRole.getRoleName(),
                        dcRole.getRemark(),
                        dcRole.getCreateTime(),
                        dcRole.getUpdateTime(),
                        dcRole.getStatus(),
                        permissionIds
                );
                roleListResponse.add(response);
            }
            return roleListResponse;
        }

        return roleListResponse;
    }

    @Transactional
    @Override
    public RoleResponse edRoleStatus(BigDecimal roleId, Boolean status) {
        DcRole dcRole = roleMapper.queryByRoleId(roleId);
        if (dcRole == null) {
            throw new BusinessException(ResponseMsgStatus.ROLE_NOT_EXIST);
        };
        roleMapper.updateRoleStatusById(roleId, status);
        List<BigDecimal> permissionIds = rolePermissionMapper.queryLeafPermissionIdsByRoleId(dcRole.getRoleId());
        return new RoleResponse(
                dcRole.getRoleId(),
                dcRole.getHighlightColor(),
                dcRole.getRoleName(),
                dcRole.getRemark(),
                dcRole.getCreateTime(),
                dcRole.getUpdateTime(),
                status,
                permissionIds
        );
    }

    @Override
    public List<PermissionTreeResponse> getPermissionTree() {
        List<DcPermission> dcPermissions = permissionMapper.queryAll();
        List<PermissionTreeResponse> permissionTreeResponses = dcPermissions.stream().map(p ->{
            return new PermissionTreeResponse(
                    p.getPermissionId(),
                    p.getPermissionName(),
                    p.getParentId(),
                    null
            );
        }).collect(Collectors.toList());
        return buildPermissionTree(permissionTreeResponses, BigDecimal.ZERO);
    }

    @Transactional
    @Override
    public void createRole(RoleRequest roleRequest) {
        DcRole existRole = roleMapper.queryByRoleName(roleRequest.getRoleName());
        if (existRole != null){
            throw new BusinessException(ResponseMsgStatus.ROLE_EXISTS);
        }
        DcRole dcRole = new DcRole();
        BeanUtils.copyProperties(roleRequest, dcRole);
        roleMapper.insertRole(dcRole);
        if (!CollectionUtils.isEmpty(roleRequest.getPermissionIds())){
            rolePermissionMapper.insertBatch(dcRole.getRoleId(), roleRequest.getPermissionIds());
        }
    }

    @Transactional
    @Override
    public void updateRole(RoleRequest roleRequest) {
        DcRole existRole = roleMapper.queryByRoleId(roleRequest.getRoleId());
        if (existRole == null){
            throw new BusinessException(ResponseMsgStatus.ROLE_NOT_EXIST);
        }

        DcRole dcRole = new DcRole();
        BeanUtils.copyProperties(roleRequest, dcRole);
        roleMapper.updateRole(dcRole);

        rolePermissionMapper.deleteByRoleId(dcRole.getRoleId());
        if (!CollectionUtils.isEmpty(roleRequest.getPermissionIds())){
            rolePermissionMapper.insertBatch(dcRole.getRoleId(), roleRequest.getPermissionIds());
        }
    }

    private List<PermissionTreeResponse> buildPermissionTree(List<PermissionTreeResponse> list, BigDecimal parentId) {
        List<PermissionTreeResponse> treeList = new ArrayList<>();
        for (PermissionTreeResponse node : list){
            if (node.getParentId().equals(parentId)){
                node.setChildren(buildPermissionTree(list, node.getKey()));
                treeList.add(node);
            }
        }
        return treeList;
    }
}
