package com.dianchong.ordersystem.service;

import com.dianchong.ordersystem.dto.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getUserList(String username, String userAccount, Boolean status);
}
