package com.dianchong.ordersystem.security;

import com.dianchong.ordersystem.entity.DcUser;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.math.BigDecimal;
import java.util.Collection;

@Getter
public class LoginUser extends User {
    private BigDecimal userId;
    private String userAccount;
    private String username;

    public LoginUser(DcUser user, Collection<? extends GrantedAuthority> authorities) {
        // 调用父类 User 的构造方法初始化 username, password, authorities
        super(user.getUserAccount(),
                user.getPassword(),
                user.getIsDisabled(),
                true,
                true,
                true,
                authorities);

        // 初始化我们要扩展的字段
        this.userId = user.getUserId();
        this.userAccount = user.getUserAccount();
        this.username = (user.getUsername() != null) ? user.getUsername() : user.getUserAccount();
    }
}
