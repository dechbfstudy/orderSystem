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
public class DcUserRole {
    private BigDecimal userId;
    private BigDecimal roleId;
}
