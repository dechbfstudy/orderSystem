package com.dianchong.ordersystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PermissionTreeResponse {
    private BigDecimal key;
    private String title;
    private BigDecimal parentId;
    private List<PermissionTreeResponse> children; // 子节点
}
