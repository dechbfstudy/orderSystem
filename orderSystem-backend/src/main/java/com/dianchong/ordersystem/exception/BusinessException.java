package com.dianchong.ordersystem.exception;

import com.dianchong.ordersystem.common.IResponseCode;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException{
    private final IResponseCode responseCode;

    /**
     * 直接传递枚举
     * 使用场景：throw new BusinessException(ResponseMsgStatus.USER_HAS_EXISTED);
     */
    public BusinessException(IResponseCode responseCode) {
        super(responseCode.getMessage());
        this.responseCode = responseCode;
    }

    /**
     * 传递枚举，但自定义错误信息
     * 使用场景：throw new BusinessException(ResponseMsgStatus.FAILED, "数据库连接超时");
     */
    public BusinessException(IResponseCode responseCode, String message) {
        super(message);
        this.responseCode = responseCode;
    }
}
