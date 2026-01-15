package com.dianchong.ordersystem.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DcUser {
    private Integer userId;
    private String username;
    private String userAccount;
    private String password;
    private LocalDateTime createTime;
    private Boolean isDisabled;
    private LocalDateTime lastLoginTime;
    private Integer loginCount;
}
