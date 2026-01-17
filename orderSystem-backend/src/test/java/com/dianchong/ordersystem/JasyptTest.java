package com.dianchong.ordersystem;

import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class JasyptTest {

    @Autowired
    private StringEncryptor stringEncryptor;

    @Test
    public void generateAes256Code() {
        // ================= 配置区域 =================
        // 1. 设置加密密钥 (也就是 jasypt.encryptor.password)
        String secretKey = "dianchong888";

        // 2. 要加密的明文
        String[] dataToEncrypt = {
                "dianchong888",         // 数据库密码
                "ZWTyiWPxC+3nzWlBjd6zlug285EwjuyTmPNLGaa4+NHP/C0fXEiRPEF5eVMDb5X8" // JWT 秘钥
        };
        // ===========================================

        // 3. 手动配置加密器 (模拟 Spring Boot 的加载过程)
        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();

        config.setPassword(secretKey);
        // 【关键】算法必须与 application.yml 一致
        config.setAlgorithm("PBEWITHHMACSHA512ANDAES_256");
        config.setKeyObtentionIterations("1000");
        config.setPoolSize("1");
        config.setProviderName("SunJCE");
        config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");
        // 【关键】AES 必须配置 IV
        config.setIvGeneratorClassName("org.jasypt.iv.RandomIvGenerator");
        config.setStringOutputType("base64");

        encryptor.setConfig(config);

        // 4. 执行加密与验证
        System.out.println("---------- AES-256 加密结果 ----------");
        for (String data : dataToEncrypt) {
            // 加密
            String encryptedText = encryptor.encrypt(data);

            // 解密验证
            String decryptedText = encryptor.decrypt(encryptedText);

            System.out.println("明文: " + data);
            System.out.println("密文: " + encryptedText);
            System.out.println("解密验证: " + decryptedText);

            // 确保解密后和原数据一致
            if (!data.equals(decryptedText)) {
                throw new RuntimeException("加密验证失败！");
            }
            System.out.println("-------------------------------------");
        }
        System.out.println("请将生成的密文填入 application.yml，格式为 ENC(密文)");
    }
}
