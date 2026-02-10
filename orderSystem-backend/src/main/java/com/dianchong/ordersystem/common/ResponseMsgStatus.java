package com.dianchong.ordersystem.common;

import lombok.Getter;

@Getter
public enum ResponseMsgStatus implements IResponseCode{
    SUCCESS(200, "Success"),
    FAILED(500, "System error"),

    INVALID_TOKEN(0001, "Invalid Token"),

    USER_NOT_EXIST(1001, "User does not exist"),
    USER_EXISTS(1002, "User already exists"),

    ROLE_NOT_EXIST(2001, "Role does not exist"),
    ROLE_EXISTS(2002, "Role already exists"),

    ;

    private final Integer code;
    private final String message;

    ResponseMsgStatus(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
