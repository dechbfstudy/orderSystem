package com.dianchong.ordersystem.service;

import com.dianchong.ordersystem.dto.TokenResponse;

public interface AuthService {

    TokenResponse login(String account, String password, Boolean rememberMe);

    TokenResponse refreshToken(String refreshToken);
}
