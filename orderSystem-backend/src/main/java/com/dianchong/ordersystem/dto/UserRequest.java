package com.dianchong.ordersystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    @NotNull
    private String username;
    @NotNull
    private String userAccount;
    private String password;
    @NotNull
    private BigDecimal roleId;
    @NotNull
    private Boolean status;
}