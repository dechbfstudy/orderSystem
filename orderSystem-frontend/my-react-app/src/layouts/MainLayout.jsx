// src/layouts/MainLayout.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Layout, Menu, Button, theme, Avatar, Dropdown, Breadcrumb,
    Drawer, Switch, Divider, Tooltip, Radio, Modal, Form, Input, message,
    Segmented, Select, Checkbox, ColorPicker, Progress, Statistic
} from 'antd';
import {
    MenuFoldOutlined, MenuUnfoldOutlined,
    DashboardOutlined, SettingOutlined, UserOutlined, ShoppingCartOutlined,
    LogoutOutlined, SkinOutlined, CheckOutlined, LockOutlined,
    SafetyCertificateOutlined, AppstoreOutlined,
    ClockCircleOutlined, PoweroffOutlined, ReloadOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppTheme } from '../context/ThemeContext';
import '../App.css';

const { Header, Sider, Content } = Layout;

// --- 配置常量 ---
// const IDLE_TIMEOUT = 10 * 60 * 1000; // 10分钟
const COUNTDOWN_DURATION = 5 * 60;   // 5分钟

// 测试用 (5秒无操作触发，10秒倒计时)
const IDLE_TIMEOUT = 5000;
// const COUNTDOWN_DURATION = 10;

const PRESET_COLORS = [
    { color: '#1677ff', name: '极客蓝' },
    { color: '#F5222D', name: '薄暮' },
    { color: '#FA541C', name: '火山' },
    { color: '#FAAD14', name: '日暮' },
    { color: '#13C2C2', name: '明青' },
    { color: '#52C41A', name: '极光绿' },
    { color: '#2F54EB', name: '酱紫' },
    { color: '#722ED1', name: '法式洋红' },
];

// ==========================================
// 1. 美化后的顶部倒计时组件
// ==========================================
const IdleWarningModal = ({ open, onLogout, onContinue, initialDuration }) => {
    const [countdown, setCountdown] = useState(initialDuration);
    const { token } = theme.useToken();

    useEffect(() => {
        let timer = null;
        if (open) {
            setCountdown(initialDuration);
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        onLogout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [open, initialDuration, onLogout]);

    // 计算进度条百分比
    const percent = (countdown / initialDuration) * 100;

    return (
        <Modal
            open={open}
            closable={false}
            maskClosable={false}
            footer={null} // 隐藏默认底部
            title={null}  // 隐藏默认标题
            width={480}
            style={{ top: 30 }} // <--- 关键：设置在顶部显示，距离顶端 30px
            maskStyle={{ backdropFilter: 'blur(3px)', background: 'rgba(0,0,0,0.2)' }} // 背景模糊
            styles={{ body: { padding: 0 } }} // 清除默认内边距，方便自定义
        >
            <div style={{
                display: 'flex',
                overflow: 'hidden',
                borderRadius: token.borderRadiusLG,
                background: '#fff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}>
                {/* 左侧：醒目倒计时区域 */}
                <div style={{
                    width: '140px',
                    background: 'linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#fff',
                    padding: '20px'
                }}>
                    <ClockCircleOutlined style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.9 }} />
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>自动退出</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', lineHeight: 1.2 }}>
                        {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                    </div>
                </div>

                {/* 右侧：内容与操作区域 */}
                <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>登录即将超时</h3>

                    <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
                        系统检测到您长时间未操作。为保护账户安全，请确认是否继续使用。
                    </p>

                    {/* 进度条 */}
                    <Progress
                        percent={percent}
                        showInfo={false}
                        strokeColor="#ff4d4f"
                        trailColor="#f0f0f0"
                        size="small"
                        style={{ marginBottom: '20px' }}
                    />

                    {/* 按钮组 */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <Button
                            danger
                            icon={<PoweroffOutlined />}
                            onClick={onLogout}
                        >
                            退出登录
                        </Button>
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={onContinue}
                            style={{ background: '#1677ff' }}
                        >
                            继续使用
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

// ==========================================
// 2. MainLayout 主组件
// ==========================================
const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [passwordForm] = Form.useForm();

    const navigate = useNavigate();
    const location = useLocation();

    const {
        isDarkMode, setIsDarkMode,
        primaryColor, setPrimaryColor,
        navTheme, setNavTheme,
        language, setLanguage, t,
        componentSize, setComponentSize,
        waveType, setWaveType,
        settingOpen, setSettingOpen
    } = useAppTheme();

    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    // --- 空闲检测逻辑 ---
    const [idleModalOpen, setIdleModalOpen] = useState(false);
    const idleTimerRef = useRef(null);

    const handleLogout = useCallback(() => {
        clearTimeout(idleTimerRef.current);
        localStorage.removeItem('token');
        message.success(t('user.logout'));
        navigate('/login');
    }, [navigate, t]);

    const startIdleTimer = useCallback(() => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
            setIdleModalOpen(true);
        }, IDLE_TIMEOUT);
    }, []);

    const resetTimerOnActivity = useCallback(() => {
        if (!idleModalOpen) {
            startIdleTimer();
        }
    }, [idleModalOpen, startIdleTimer]);

    const handleContinue = () => {
        setIdleModalOpen(false);
        startIdleTimer();
    };

    useEffect(() => {
        const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetTimerOnActivity));
        startIdleTimer();
        return () => {
            events.forEach(event => window.removeEventListener(event, resetTimerOnActivity));
            clearTimeout(idleTimerRef.current);
        };
    }, [resetTimerOnActivity, startIdleTimer]);

    // --- 常规 Layout 逻辑 ---

    const colorPickerPresets = [
        { label: '推荐颜色', colors: PRESET_COLORS.map((c) => c.color) },
    ];

    const menuItems = [
        { key: '/dashboard', icon: <DashboardOutlined />, label: t('menu.dashboard') },
        {
            key: 'sub-system',
            icon: <SettingOutlined />,
            label: t('menu.system'),
            children: [
                { key: '/system/permissions', icon: <SafetyCertificateOutlined />, label: t('menu.permissions') },
                { key: '/system/menus', icon: <AppstoreOutlined />, label: t('menu.menus') },
            ]
        },
        { key: '/users', icon: <UserOutlined />, label: t('menu.users') },
        { key: '/orders', icon: <ShoppingCartOutlined />, label: t('menu.orders') },
    ];

    const breadcrumbNameMap = {
        '/dashboard': t('menu.dashboard'),
        '/system': t('menu.system'),
        '/system/permissions': t('menu.permissions'),
        '/system/menus': t('menu.menus'),
        '/users': t('menu.users'),
        '/orders': t('menu.orders'),
    };

    const [openKeys, setOpenKeys] = useState([]);

    useEffect(() => {
        if (location.pathname.startsWith('/system')) {
            setOpenKeys(['sub-system']);
        }
    }, [location.pathname]);

    const handleChangePassword = async () => {
        setTimeout(() => {
            message.success('密码修改成功，请重新登录');
            setPasswordModalOpen(false);
            passwordForm.resetFields();
            handleLogout();
        }, 1000);
    };

    const userMenuTokens = {
        items: [
            { key: 'settings', icon: <SkinOutlined />, label: t('user.settings'), onClick: () => setSettingOpen(true) },
            { key: 'password', icon: <LockOutlined />, label: t('user.password'), onClick: () => setPasswordModalOpen(true) },
            { type: 'divider' },
            { key: 'logout', icon: <LogoutOutlined />, label: t('user.logout'), onClick: handleLogout }
        ]
    };

    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const breadcrumbItems = [
        { title: <Link to="/dashboard">{t('menu.dashboard')}</Link>, key: 'home' },
    ];
    pathSnippets.forEach((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        if (url === '/dashboard') return;
        if (breadcrumbNameMap[url]) {
            const isClickable = url !== '/system';
            breadcrumbItems.push({
                title: isClickable ? <Link to={url}>{breadcrumbNameMap[url]}</Link> : breadcrumbNameMap[url],
                key: url
            });
        }
    });

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme={navTheme}>
                <div style={{
                    height: 32, margin: 16,
                    background: navTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.06)',
                    textAlign: 'center', color: navTheme === 'dark' ? '#fff' : '#000',
                    lineHeight: '32px', fontWeight: 'bold', borderRadius: 6
                }}>
                    {collapsed ? 'Logo' : 'React Admin'}
                </div>
                <Menu
                    theme={navTheme}
                    mode="inline"
                    defaultSelectedKeys={['/dashboard']}
                    selectedKeys={[location.pathname]}
                    openKeys={openKeys}
                    onOpenChange={setOpenKeys}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>

            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                    <div style={{ marginRight: 24 }}>
                        <Dropdown menu={userMenuTokens}>
              <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar style={{ backgroundColor: primaryColor }} icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>{t('user.admin')}</span>
              </span>
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
                    <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>

            <Drawer
                title={t('settings.title')}
                placement="right"
                onClose={() => setSettingOpen(false)}
                open={settingOpen}
                width={360}
            >
                <div style={{ marginBottom: 24 }}>
                    <h4>{t('settings.language')}</h4>
                    <Segmented options={[{ label: '简体中文', value: 'zh' }, { label: 'English', value: 'en' }]} value={language} onChange={setLanguage} block />
                </div>

                <div style={{ marginBottom: 24 }}>
                    <h4>{t('settings.size')}</h4>
                    <Segmented options={['small', 'middle', 'large']} value={componentSize} onChange={setComponentSize} block />
                </div>

                <div style={{ marginBottom: 24 }}>
                    <h4>{t('settings.wave')}</h4>
                    <Select
                        value={waveType} onChange={setWaveType} style={{ width: '100%' }}
                        options={[
                            { value: 'default', label: 'Default' },
                            { value: 'inset', label: 'Inset' },
                            { value: 'shake', label: 'Shake' },
                            { value: 'happy', label: 'Happy' }
                        ]}
                    />
                    <div style={{ marginTop: 12, padding: 12, background: isDarkMode ? '#333' : '#f5f5f5', borderRadius: 8 }}>
                        <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>Test Interaction:</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <Button type="primary">Button</Button>
                            <Switch defaultChecked />
                            <Checkbox>Check</Checkbox>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <h4>{t('settings.theme')}</h4>
                    <Radio.Group value={navTheme} onChange={(e) => setNavTheme(e.target.value)}>
                        <Radio value="dark">Dark</Radio>
                        <Radio value="light">Light</Radio>
                    </Radio.Group>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <h4>{t('settings.primaryColor')}</h4>
                    <ColorPicker
                        value={primaryColor}
                        onChange={(color) => setPrimaryColor(color.toHexString())}
                        showText
                        presets={colorPickerPresets}
                        disabledAlpha
                    />
                </div>

                <div style={{ marginBottom: 24 }}>
                    <h4>{t('settings.darkMode')}</h4>
                    <Switch checked={isDarkMode} onChange={setIsDarkMode} />
                </div>
            </Drawer>

            <Modal title={t('user.password')} open={passwordModalOpen} onOk={() => passwordForm.submit()} onCancel={() => setPasswordModalOpen(false)}>
                <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
                    <Form.Item name="oldPassword" label="Old Password" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 6 }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="confirmPassword" label="Confirm" dependencies={['newPassword']} rules={[{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('newPassword') === value) return Promise.resolve(); return Promise.reject(new Error('Mismatch!')); }, }),]}>
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 3. 使用美化后的顶部倒计时组件 */}
            <IdleWarningModal
                open={idleModalOpen}
                onLogout={handleLogout}
                onContinue={handleContinue}
                initialDuration={COUNTDOWN_DURATION}
            />
        </Layout>
    );
};

export default MainLayout;