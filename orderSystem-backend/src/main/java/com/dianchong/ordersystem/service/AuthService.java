package com.dianchong.ordersystem.service;

import com.dianchong.ordersystem.dto.TokenResponse;

public interface AuthService {

    TokenResponse login(String account, String password);

    TokenResponse refreshToken(String refreshToken);
}
