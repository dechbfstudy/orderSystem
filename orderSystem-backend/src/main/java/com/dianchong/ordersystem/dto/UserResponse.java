package com.dianchong.ordersystem.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UserResponse {
    private BigDecimal key;
    private String username;
    private String userAccount;
    private String roleName;

}
