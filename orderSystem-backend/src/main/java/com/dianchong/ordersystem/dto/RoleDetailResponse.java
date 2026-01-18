package com.dianchong.ordersystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleDetailResponse {
    private String roleName;
    private String remark;
    private Boolean status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    private List<BigDecimal> permissionIds;
}
