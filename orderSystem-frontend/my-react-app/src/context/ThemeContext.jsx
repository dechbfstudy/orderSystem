// src/context/ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { HappyProvider } from '@ant-design/happy-work-theme';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import 'dayjs/locale/zh-cn';
import { showShakeEffect } from '../utils/happyWave';

// 1. 引入外部的翻译文件
import { enTranslations } from '../locales';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('isDarkMode') === 'true');
    const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('primaryColor') || '#1677ff');
    const [navTheme, setNavTheme] = useState(localStorage.getItem('navTheme') || 'dark');
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'zh');
    const [componentSize, setComponentSize] = useState('middle');
    const [waveType, setWaveType] = useState('default');
    const [settingOpen, setSettingOpen] = useState(false);

    useEffect(() => { localStorage.setItem('isDarkMode', isDarkMode); }, [isDarkMode]);
    useEffect(() => { localStorage.setItem('primaryColor', primaryColor); }, [primaryColor]);
    useEffect(() => { localStorage.setItem('navTheme', navTheme); }, [navTheme]);
    useEffect(() => { localStorage.setItem('language', language); }, [language]);

    // 2. 这里的 t 函数逻辑保持简洁
    const t = (text) => {
        // 中文模式：直接返回原文本
        if (language === 'zh') return text;
        // 英文模式：去外部文件找，找不到就显示原文本（兜底）
        return enTranslations[text] || text;
    };

    const baseConfig = {
        locale: language === 'zh' ? zhCN : enUS,
        componentSize: componentSize,
        theme: {
            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: { colorPrimary: primaryColor },
        },
    };

    const getCustomWaveConfig = () => {
        if (waveType === 'inset') return { disabled: true };
        if (waveType === 'shake') return { showEffect: (node) => showShakeEffect(node) };
        return undefined;
    };

    return (
        <ThemeContext.Provider value={{
            isDarkMode, setIsDarkMode,
            primaryColor, setPrimaryColor,
            navTheme, setNavTheme,
            language, setLanguage, t, // 导出 t
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