package com.dianchong.ordersystem.mapper;

import com.dianchong.ordersystem.entity.DcRole;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DcRoleMapper {
    List<DcRole> queryByRoleName(String roleName);
}
