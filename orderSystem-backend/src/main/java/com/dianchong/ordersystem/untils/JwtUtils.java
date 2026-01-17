package com.dianchong.ordersystem.untils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String SECRET;

    @Value("${jwt.access-token-validity}")
    private long ACCESS_TOKEN_EXPIRATION;

    @Value("${jwt.refresh-token-validity}")
    private long REFRESH_TOKEN_EXPIRATION;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // 1. 生成 Access Token (短效)
    public String generateAccessToken(String username) {
        return buildToken(new HashMap<>(), username, ACCESS_TOKEN_EXPIRATION);
    }

    // 2. 生成 Refresh Token (长效)
    public String generateRefreshToken(String username) {
        return generateRefreshToken(username, REFRESH_TOKEN_EXPIRATION);
    }

    private String buildToken(Map<String, Object> claims, String subject, long expiration) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(String username, long expiration) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 3. 从 Token 中提取用户名
    public String extractUserAccount(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 4. 获取过期时间
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody();
    }

    // 5. 校验 Token 是否有效 (校验用户名 + 是否过期)
    public boolean validateToken(String token, String username) {
        try {
            final String extractedUsername = extractUserAccount(token);
            return (extractedUsername.equals(username) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    // 6. 仅检查 Token 是否过期 (用于 Refresh 逻辑)
    public boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (Exception e) {
            return true; // 解析失败视为过期
        }
    }
}