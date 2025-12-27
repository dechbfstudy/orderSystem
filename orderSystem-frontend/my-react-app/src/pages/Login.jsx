// src/pages/Login.jsx
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppTheme } from '../context/ThemeContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { t } = useAppTheme();

    const onFinish = (values) => {
        setLoading(true);
        setTimeout(() => {
            localStorage.setItem('token', 'dummy-token');
            message.success(t('登录成功！'));
            setLoading(false);
            navigate('/');
        }, 800);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card title={t('系统登录')} style={{ width: 400 }} bordered={false}>
                <Form name="normal_login" initialValues={{ remember: true }} onFinish={onFinish} size="large">
                    <Form.Item name="username" rules={[{ required: true, message: t('请输入用户名!') }]}>
                        <Input prefix={<UserOutlined />} placeholder={t('用户名')} />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: t('请输入密码!')}]}>
                        <Input prefix={<LockOutlined />} type="password" placeholder={t('密码')} />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>{t('记住我')}</Checkbox>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            {t('登录')}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};
export default LoginPage;