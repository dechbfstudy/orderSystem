package com.dianchong.ordersystem.mapper;

import com.dianchong.ordersystem.entity.DcUser;
import org.apache.ibatis.annotations.Mapper;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface DcUserMapper {
    List<DcUser> queryAllUsers();

    DcUser queryByAccount(String account);

    void updateLoginInfo(BigDecimal userId);
}
