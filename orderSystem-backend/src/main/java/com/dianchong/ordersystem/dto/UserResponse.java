package com.dianchong.ordersystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private BigDecimal key;
    private String username;
    private String userAccount;
    private String roleName;
    private String highlightColor;
    private LocalDateTime createTime;
    private LocalDateTime lastLoginTime;
    private Integer loginCount;
    private Boolean status;
}
