package com.dianchong.ordersystem.mapper;

import com.dianchong.ordersystem.dto.UserResponse;
import com.dianchong.ordersystem.entity.DcUser;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DcUserMapper {
    List<UserResponse> queryUserInfo(String username, String userAccount, Boolean status);

    DcUser queryByAccount(String account);

    void updateLoginInfo(String account);
}
