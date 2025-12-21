// src/context/ThemeContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { ConfigProvider, theme } from 'antd';
// 确保安装了 npm install @ant-design/happy-work-theme
import { HappyProvider } from '@ant-design/happy-work-theme';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import 'dayjs/locale/zh-cn';

// 引入刚才修复的工具函数
import { showShakeEffect } from '../utils/happyWave';

const ThemeContext = createContext();

const translations = {
    zh: {
        'menu.dashboard': '主页',
        'menu.system': '系统设置',
        'menu.permissions': '权限设置',
        'menu.menus': '菜单管理',
        'menu.users': '用户管理',
        'menu.orders': '订单管理',
        'settings.title': '个性化设置',
        'settings.theme': '侧边栏风格',
        'settings.primaryColor': '主题色',
        'settings.darkMode': '全局暗黑模式',
        'settings.language': '语言设置',
        'settings.size': '组件尺寸',
        'settings.wave': '波纹效果',
        'user.admin': '管理员',
        'user.settings': '个性化设置',
        'user.password': '修改密码',
        'user.logout': '退出登录',
        'login.title': '系统登录',
        'login.btn': '登录',
    },
    en: {
        'menu.dashboard': 'Dashboard',
        'menu.system': 'System Settings',
        'menu.permissions': 'Permissions',
        'menu.menus': 'Menu Management',
        'menu.users': 'User Management',
        'menu.orders': 'Order Management',
        'settings.title': 'Personalization',
        'settings.theme': 'Sidebar Style',
        'settings.primaryColor': 'Primary Color',
        'settings.darkMode': 'Dark Mode',
        'settings.language': 'Language',
        'settings.size': 'Component Size',
        'settings.wave': 'Ripple Effect',
        'user.admin': 'Admin',
        'user.settings': 'Settings',
        'user.password': 'Change Password',
        'user.logout': 'Logout',
        'login.title': 'System Login',
        'login.btn': 'Login',
    }
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [primaryColor, setPrimaryColor] = useState('#1677ff');
    const [navTheme, setNavTheme] = useState('dark');
    const [language, setLanguage] = useState('zh');
    const [componentSize, setComponentSize] = useState('middle');
    const [waveType, setWaveType] = useState('default');

    // 抽屉状态
    const [settingOpen, setSettingOpen] = useState(false);

    const t = (key) => translations[language][key] || key;

    const getCustomWaveConfig = () => {
        if (waveType === 'inset') return { disabled: true };
        if (waveType === 'shake') return { showEffect: (node) => showShakeEffect(node) };
        return undefined;
    };

    const baseConfig = {
        locale: language === 'zh' ? zhCN : enUS,
        componentSize: componentSize,
        theme: {
            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: { colorPrimary: primaryColor },
        },
    };

    return (
        <ThemeContext.Provider value={{
            isDarkMode, setIsDarkMode,
            primaryColor, setPrimaryColor,
            navTheme, setNavTheme,
            language, setLanguage, t,
            componentSize, setComponentSize,
            waveType, setWaveType,
            settingOpen, setSettingOpen
        }}>
            <ConfigProvider {...baseConfig}>
                {waveType === 'happy' ? (
                    <HappyProvider>
                        {children}
                    </HappyProvider>
                ) : (
                    <ConfigProvider wave={getCustomWaveConfig()}>
                        {children}
                    </ConfigProvider>
                )}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => useContext(ThemeContext);