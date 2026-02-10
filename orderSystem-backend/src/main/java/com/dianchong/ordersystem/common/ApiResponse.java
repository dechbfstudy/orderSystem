package com.dianchong.ordersystem.common;

import lombok.Data;

/**
 * 统一响应类
 * @param <T> 数据类型
 */
@Data
public class ApiResponse<T> {

    // 状态码 (例如: 200成功, 500系统异常, 400参数错误)
    private Integer code;

    // 提示信息 (例如: "操作成功", "用户不存在")
    private String message;

    // 返回的数据 (可以是对象、List、Map等)
    private T data;

    // 私有构造，强制使用静态方法创建
    private ApiResponse(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(ResponseMsgStatus.SUCCESS.getCode(), ResponseMsgStatus.SUCCESS.getMessage(), data);
    }
    public static <T> ApiResponse<T> success() {
        return new ApiResponse<>(ResponseMsgStatus.SUCCESS.getCode(), ResponseMsgStatus.SUCCESS.getMessage(), null);
    }

    public static <T> ApiResponse<T> error(Integer code, String message) {
        return new ApiResponse<>(code, message, null);
    }

    public static <T> ApiResponse<T> error(IResponseCode errorCode, String message) {
        return new ApiResponse<>(errorCode.getCode(), message, null);
    }
}