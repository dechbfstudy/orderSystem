package com.dianchong.ordersystem.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DcPermission {
    private BigDecimal permissionId;
    private String permissionName;
    private BigDecimal parentId;
    private String permissionKey;
    private String remark;
}
