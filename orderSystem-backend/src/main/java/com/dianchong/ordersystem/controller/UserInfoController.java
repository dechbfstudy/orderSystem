package com.dianchong.ordersystem.controller;

import com.dianchong.ordersystem.dto.UserResponse;
import com.dianchong.ordersystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserInfoController {

    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public ResponseEntity<List<UserResponse>> getUserInfo(@RequestParam(value = "username", required = false) String username,
                                                          @RequestParam(value = "account", required = false) String account,
                                                          @RequestParam(value = "status", required = false) Boolean status){
        List<UserResponse> userList = userService.getUserList(username, account, status);
        return ResponseEntity.ok(userList);
    }


}
