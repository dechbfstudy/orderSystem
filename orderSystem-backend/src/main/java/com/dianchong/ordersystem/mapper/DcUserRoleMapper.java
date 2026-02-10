package com.dianchong.ordersystem.mapper;

import com.dianchong.ordersystem.entity.DcUserRole;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcUserRoleMapper {
    void insertUserRole(DcUserRole dcUserRole);
}
