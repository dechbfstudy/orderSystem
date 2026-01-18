package com.dianchong.ordersystem.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface DcRolePermissionMapper {
    List<BigDecimal> queryPermissionIdByRoleId(BigDecimal roleId);
    List<BigDecimal> queryLeafPermissionIdsByRoleId(BigDecimal roleId);
}
