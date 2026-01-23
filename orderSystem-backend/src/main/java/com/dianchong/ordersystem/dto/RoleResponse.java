package com.dianchong.ordersystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponse {
    private BigDecimal key;
    private String highlightColor;
    private String roleName;
    private String remark;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Boolean status;

    private List<BigDecimal> permissionIds;
}
