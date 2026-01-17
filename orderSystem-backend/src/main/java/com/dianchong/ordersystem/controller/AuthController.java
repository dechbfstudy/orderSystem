package com.dianchong.ordersystem.controller;

import com.dianchong.ordersystem.dto.LoginRequest;
import com.dianchong.ordersystem.dto.RefreshTokenRequest;
import com.dianchong.ordersystem.dto.TokenResponse;
import com.dianchong.ordersystem.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * 登录接口：返回 AccessToken 和 RefreshToken
     */
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {

        TokenResponse tokenResponse = authService.login(request.getUserAccount(), request.getPassword(), request.getRememberMe());

        return ResponseEntity.ok(tokenResponse);
    }

    /**
     * 刷新 Token 接口：用 RefreshToken 换取新的 AccessToken
     */
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        TokenResponse tokenResponse = authService.refreshToken(refreshToken);

        return ResponseEntity.ok(tokenResponse);
    }
}
