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
            message.success('登录成功！');
            setLoading(false);
            navigate('/');
        }, 800);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card title={t('login.title')} style={{ width: 400 }} bordered={false}>
                <Form name="normal_login" initialValues={{ remember: true }} onFinish={onFinish} size="large">
                    <Form.Item name="username" rules={[{ required: true, message: 'Please input Username!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Please input Password!' }]}>
                        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            {t('login.btn')}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};
export default LoginPage;