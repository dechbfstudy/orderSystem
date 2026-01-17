package com.dianchong.ordersystem.service.impl;

import com.dianchong.ordersystem.entity.DcUser;
import com.dianchong.ordersystem.mapper.DcUserMapper;
import com.dianchong.ordersystem.security.LoginUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private DcUserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String account) {
        DcUser user = userMapper.queryByAccount(account);
        if (user == null){
            throw new UsernameNotFoundException("用户不存在");
        }

        //查询权限

        return new LoginUser(user,
                new ArrayList<>()
                );
    }
}