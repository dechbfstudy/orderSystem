package com.dianchong.ordersystem;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest// 加载 Spring 上下文，确保能获取到 SecurityConfig 中配置的 Bean
public class PasswordGenTest {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void generatePassword() {
        // 1. 定义你要设置的明文密码
        String rawPassword = "guest123";

        // 2. 进行加密
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 3. 打印结果到控制台
        System.out.println("=========================================");
        System.out.println("原始密码: " + rawPassword);
        System.out.println("加密结果 (请复制下方字符串):");
        System.out.println(encodedPassword);
        System.out.println("=========================================");

        // 验证一下是否匹配 (可选)
        boolean matches = passwordEncoder.matches(rawPassword, encodedPassword);
        System.out.println("自测验证结果: " + matches);
    }
}
