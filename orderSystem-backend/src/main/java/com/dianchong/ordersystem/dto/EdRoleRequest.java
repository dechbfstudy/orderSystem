package com.dianchong.ordersystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class EdRoleRequest {
    @NotNull
    private BigDecimal roleId;
    @NotNull
    private Boolean status;
}
