package com.dianchong.ordersystem.controller;

import com.dianchong.ordersystem.common.ApiResponse;
import com.dianchong.ordersystem.dto.UserRequest;
import com.dianchong.ordersystem.dto.UserResponse;
import com.dianchong.ordersystem.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserInfoController {

    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public ApiResponse<List<UserResponse>> getUserInfo(@RequestParam(value = "username", required = false) String username,
                                                       @RequestParam(value = "account", required = false) String account,
                                                       @RequestParam(value = "status", required = false) Boolean status){
        List<UserResponse> userList = userService.getUserList(username, account, status);
        return ApiResponse.success(userList);
    }

    @PostMapping("/create")
    public ApiResponse<String> createUser(@Valid @RequestBody UserRequest userRequest){
        userService.createUser(userRequest);
        return ApiResponse.success();
    }
}
