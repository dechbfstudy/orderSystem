package com.dianchong.ordersystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class RoleRequest {
    private BigDecimal roleId;

    @NotNull
    private String roleName;
    private String remark;
    private Boolean status;

    private List<BigDecimal> permissionIds;
}
