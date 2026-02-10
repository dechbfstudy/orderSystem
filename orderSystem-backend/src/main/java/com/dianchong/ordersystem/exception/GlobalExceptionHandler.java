package com.dianchong.ordersystem.exception;

import com.dianchong.ordersystem.common.ApiResponse;
import com.dianchong.ordersystem.common.ResponseMsgStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // 捕获所有异常
    @ExceptionHandler(Exception.class)
    public ApiResponse<Void> handleException(Exception e) {
        e.printStackTrace();

        return ApiResponse.error(ResponseMsgStatus.FAILED.getCode(), e.getMessage());
    }

    @ExceptionHandler(BusinessException.class)
    public ApiResponse<Void> handleBusinessException(BusinessException e) {
        return ApiResponse.error(e.getResponseCode(), e.getMessage());
    }
}
