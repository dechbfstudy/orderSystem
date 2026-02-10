package com.dianchong.ordersystem.mapper;

import com.dianchong.ordersystem.entity.DcRole;
import org.apache.ibatis.annotations.Mapper;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface DcRoleMapper {
    List<DcRole> queryByConcatRoleNameAndStatus(String roleName,Boolean status);

    DcRole queryByRoleId(BigDecimal roleId);

    DcRole queryByRoleName(String roleName);

    int updateRoleStatusById(BigDecimal roleId, Boolean status);

    void insertRole(DcRole role);

    void updateRole(DcRole role);
}
