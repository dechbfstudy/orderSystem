package com.dianchong.ordersystem.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DcRole {
    private BigDecimal roleId;
    private String roleName;
    private Boolean status;
    private String remark;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
