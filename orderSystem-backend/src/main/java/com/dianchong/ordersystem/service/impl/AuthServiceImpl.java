package com.dianchong.ordersystem.service.impl;

import com.dianchong.ordersystem.dto.TokenResponse;
import com.dianchong.ordersystem.entity.DcUser;
import com.dianchong.ordersystem.mapper.DcUserMapper;
import com.dianchong.ordersystem.service.AuthService;
import com.dianchong.ordersystem.untils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private DcUserMapper userMapper;

    @Override
    public TokenResponse login(String account, String password, Boolean rememberMe) {
        // 1. Spring Security 认证 (Argon2 校验)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(account, password)
        );

        // 2. 认证成功，获取用户名
        String userAccount = authentication.getName();

        // 3. 更新数据库登录信息
        userMapper.updateLoginInfo(userAccount);

        // 4. 生成双 Token
        String accessToken = jwtUtils.generateAccessToken(userAccount);

        String refreshToken = jwtUtils.generateRefreshToken(userAccount);
        if (Boolean.FALSE.equals(rememberMe)){
            // 否则：默认 1天
            long refreshExpiration = 86400000L;
            refreshToken = jwtUtils.generateRefreshToken(userAccount, refreshExpiration);
        }

        return new TokenResponse(accessToken, refreshToken);
    }

    @Override
    public TokenResponse refreshToken(String refreshToken) {
        // 1. 校验 Refresh Token 格式和过期时间
        if (refreshToken == null || jwtUtils.isTokenExpired(refreshToken)) {
            // 返回 403 Forbidden，前端接收到后应跳转登录页
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Refresh token 已过期或无效，请重新登录");
        }

        // 2. 提取用户名
        String userAccount;
        try {
            userAccount = jwtUtils.extractUserAccount(refreshToken);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无效的 Token");
        }

        // 3. 【关键安全步骤】查询数据库，确保用户未被禁用/删除
        DcUser user = userMapper.queryByAccount(userAccount);
        if (user == null || !user.getIsDisabled()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "账号已禁用或不存在");
        }

        // 4. 签发新的 Access Token (10分钟)
        String newAccessToken = jwtUtils.generateAccessToken(userAccount);

        // 5. 决定是否轮换 Refresh Token
        // 策略 A: Refresh Token 保持不变 (直到7天过期)，实现简单。
        // 策略 B: 每次刷新也发新的 Refresh Token (更安全，但前端并发处理稍微麻烦点)。
        // 这里演示策略 A，只返回新的 AccessToken，RefreshToken 原样返回或返回 null 让前端复用
        return new TokenResponse(newAccessToken, refreshToken);
    }
}
