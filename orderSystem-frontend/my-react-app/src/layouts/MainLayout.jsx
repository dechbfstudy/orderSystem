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
        { key: '/dashboard', icon: <DashboardOutlined />, label: t('主页') },
        {
            key: 'sub-system',
            icon: <SettingOutlined />,
            label: t('系统设置'),
            children: [
                { key: '/system/permissions', icon: <SafetyCertificateOutlined />, label: t('权限设置') },
                { key: '/system/menus', icon: <AppstoreOutlined />, label: t('菜单管理') },
            ]
        },
        { key: '/users', icon: <UserOutlined />, label: t('用户管理') },
        { key: '/orders', icon: <ShoppingCartOutlined />, label: t('订单管理') },
    ];

    // 面包屑映射
    const breadcrumbNameMap = {
        '/dashboard': t('主页'),
        '/system': t('系统设置'),
        '/system/permissions': t('权限设置'),
        '/system/menus': t('菜单管理'),
        '/users': t('用户管理'),
        '/orders': t('订单管理'),
    };

    const [openKeys, setOpenKeys] = useState([]);

    useEffect(() => {
        if (location.pathname.startsWith('/system')) {
            setOpenKeys(['sub-system']);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        message.success(t('退出成功！'));
        navigate('/login');
    };

    const handleChangePassword = async () => {
        setTimeout(() => {
            message.success(t('密码修改成功，请重新登录'));
            setPasswordModalOpen(false);
            passwordForm.resetFields();
            handleLogout();
        }, 1000);
    };

    const userMenuTokens = {
        items: [
            { key: 'settings', icon: <SkinOutlined />, label: t('个性化设置'), onClick: () => setSettingOpen(true) },
            { key: 'password', icon: <LockOutlined />, label: t('修改密码'), onClick: () => setPasswordModalOpen(true) },
            { type: 'divider' },
            { key: 'logout', icon: <LogoutOutlined />, label: t('退出登录'), onClick: handleLogout }
        ]
    };

    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const breadcrumbItems = [
        { title: <Link to="/dashboard">{t('主页')}</Link>, key: 'home' },
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
                <span style={{ marginLeft: 8 }}>{t('管理员')}</span>
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
                title={t('个性化设置')}
                placement="right"
                onClose={() => setSettingOpen(false)}
                open={settingOpen}
                width={360}
            >
                <div style={{ marginBottom: 24 }}>
                    <h4>{t('语言设置')}</h4>
                    <Segmented options={[{ label: t('中文'), value: 'zh' }, { label: t('英文'), value: 'en' }]} value={language} onChange={setLanguage} block />
                </div>

                <div style={{ marginBottom: 24 }}>
                    <h4>{t('组件尺寸')}</h4>
                    <Segmented options={['small', 'middle', 'large']} value={componentSize} onChange={setComponentSize} block />
                </div>

                <div style={{ marginBottom: 24 }}>
                    <h4>{t('波纹效果')}</h4>
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
                        <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{t('测试交互')}</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <Button type="primary">{t('按钮')}</Button>
                            <Switch defaultChecked />
                            <Checkbox>{t('勾选框')}</Checkbox>
                        </div>
                    </div>
                </div>

                <Divider />

                <div style={{ marginBottom: 24 }}>
                    <h4>{t('侧边栏风格')}</h4>
                    <Radio.Group value={navTheme} onChange={(e) => setNavTheme(e.target.value)}>
                        <Radio value="dark">{t('暗色')}</Radio>
                        <Radio value="light">{t('亮色')}</Radio>
                    </Radio.Group>
                </div>

                {/* --- 3. 修改处：使用 ColorPicker --- */}
                <div style={{ marginBottom: 24 }}>
                    <h4>{t('主题色')}</h4>
                    <ColorPicker
                        value={primaryColor}
                        onChange={(color) => setPrimaryColor(color.toHexString())} // 转换颜色对象为 Hex 字符串
                        showText // 显示颜色文本
                        presets={colorPickerPresets} // 使用预设颜色
                        disabledAlpha // 禁用透明度（主题色通常不需要透明）
                    />
                </div>

                <div style={{ marginBottom: 24 }}>
                    <h4>{t('全局暗黑模式')}</h4>
                    <Switch checked={isDarkMode} onChange={setIsDarkMode} />
                </div>
            </Drawer>

            <Modal title={t('修改密码')} open={passwordModalOpen} onOk={() => passwordForm.submit()} onCancel={() => setPasswordModalOpen(false)}>
                <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
                    <Form.Item name="oldPassword" label={t('原密码')} rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="newPassword" label={t('新密码')} rules={[{ required: true, min: 6 }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="confirmPassword" label={t('确认新密码')} dependencies={['newPassword']} rules={[{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('newPassword') === value) return Promise.resolve(); return Promise.reject(new Error(t('两次输入的密码不一致!'))); }, }),]}>
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default MainLayout;