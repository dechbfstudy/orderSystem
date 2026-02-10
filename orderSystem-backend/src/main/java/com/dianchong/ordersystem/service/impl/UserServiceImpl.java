package com.dianchong.ordersystem.service.impl;

import com.dianchong.ordersystem.common.ResponseMsgStatus;
import com.dianchong.ordersystem.dto.UserRequest;
import com.dianchong.ordersystem.dto.UserResponse;
import com.dianchong.ordersystem.entity.DcRole;
import com.dianchong.ordersystem.entity.DcUser;
import com.dianchong.ordersystem.entity.DcUserRole;
import com.dianchong.ordersystem.exception.BusinessException;
import com.dianchong.ordersystem.mapper.DcRoleMapper;
import com.dianchong.ordersystem.mapper.DcUserMapper;
import com.dianchong.ordersystem.mapper.DcUserRoleMapper;
import com.dianchong.ordersystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private DcUserMapper userMapper;

    @Autowired
    private DcRoleMapper roleMapper;

    @Autowired
    private DcUserRoleMapper userRoleMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<UserResponse> getUserList(String username, String userAccount, Boolean status) {
        return userMapper.queryUserInfo(username, userAccount, status);
    }

    @Override
    public void createUser(UserRequest userRequest) {
        DcRole dcRole = roleMapper.queryByRoleId(userRequest.getRoleId());
        if(ObjectUtils.isEmpty(dcRole)){
            throw new BusinessException(ResponseMsgStatus.ROLE_NOT_EXIST);
        }
        //检查账号是否存在
        DcUser existingUser = userMapper.queryByAccount(userRequest.getUserAccount());
        if (existingUser != null) {
            throw new BusinessException(ResponseMsgStatus.USER_EXISTS);
        }

        //密码加密
        String password = passwordEncoder.encode(userRequest.getPassword());
        DcUser dcUser = new DcUser(
                null,
                userRequest.getUsername(),
                userRequest.getUserAccount(),
                password,
                null,
                userRequest.getStatus(),
                null,
                null
        );
        //insert user
        userMapper.insertUser(dcUser);
        //insert user role
        DcUserRole dcUserRole = new DcUserRole(
                dcUser.getUserId(),
                userRequest.getRoleId()
        );
        userRoleMapper.insertUserRole(dcUserRole);
    }
}
