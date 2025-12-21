// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import {
    Layout, Menu, Button, theme, Avatar, Dropdown, Breadcrumb,
    Drawer, Switch, Divider, Tooltip, Radio, Modal, Form, Input, message,
    Segmented, Select, Checkbox, ColorPicker // <--- 1. 引入 ColorPicker
} from 'antd';
import {
    MenuFoldOutlined, MenuUnfoldOutlined,
    DashboardOutlined, SettingOutlined, UserOutlined, ShoppingCartOutlined,
    LogoutOutlined, SkinOutlined, CheckOutlined, LockOutlined,
    SafetyCertificateOutlined, AppstoreOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppTheme } from '../context/ThemeContext';
import '../App.css';

const { Header, Sider, Content } = Layout;

// 预设颜色数据
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

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [passwordForm] = Form.useForm();

    const navigate = useNavigate();
    const location = useLocation();

    // 从 Context 中获取全局状态
    const {
        isDarkMode, setIsDarkMode,
        primaryColor, setPrimaryColor,
        navTheme, setNavTheme,
        language, setLanguage, t,
        componentSize, setComponentSize,
        waveType, setWaveType,
        settingOpen, setSettingOpen // 抽屉状态
    } = useAppTheme();

    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    // 2. 准备颜色选择器的预设列表
    const colorPickerPresets = [
        {
            label: '推荐颜色',
            colors: PRESET_COLORS.map((c) => c.color),
        },
    ];

    // 菜单结构
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

    // 面包屑映射
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        message.success(t('user.logout'));
        navigate('/login');
    };

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

            {/* 设置抽屉 */}
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

                <Divider />

                <div style={{ marginBottom: 24 }}>
                    <h4>{t('settings.theme')}</h4>
                    <Radio.Group value={navTheme} onChange={(e) => setNavTheme(e.target.value)}>
                        <Radio value="dark">Dark</Radio>
                        <Radio value="light">Light</Radio>
                    </Radio.Group>
                </div>

                {/* --- 3. 修改处：使用 ColorPicker --- */}
                <div style={{ marginBottom: 24 }}>
                    <h4>{t('settings.primaryColor')}</h4>
                    <ColorPicker
                        value={primaryColor}
                        onChange={(color) => setPrimaryColor(color.toHexString())} // 转换颜色对象为 Hex 字符串
                        showText // 显示颜色文本
                        presets={colorPickerPresets} // 使用预设颜色
                        disabledAlpha // 禁用透明度（主题色通常不需要透明）
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
        </Layout>
    );
};

export default MainLayout;