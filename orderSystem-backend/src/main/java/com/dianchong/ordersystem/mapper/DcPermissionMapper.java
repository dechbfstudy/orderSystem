package com.dianchong.ordersystem.mapper;

import com.dianchong.ordersystem.entity.DcPermission;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DcPermissionMapper {
    List<DcPermission> queryAll();
}
