package com.dianchong.ordersystem.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String userAccount;
    private String password;
}

