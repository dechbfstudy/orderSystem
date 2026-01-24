package com.dianchong.ordersystem.service.impl;

import com.dianchong.ordersystem.dto.UserResponse;
import com.dianchong.ordersystem.mapper.DcUserMapper;
import com.dianchong.ordersystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private DcUserMapper userMapper;

    @Override
    public List<UserResponse> getUserList(String username, String userAccount, Boolean status) {
        return userMapper.queryUserInfo(username, userAccount, status);
    }
}
