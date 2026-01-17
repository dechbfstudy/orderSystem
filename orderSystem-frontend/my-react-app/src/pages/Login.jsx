// src/pages/Login.jsx
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppTheme } from '../context/ThemeContext';
import { login } from '../api/auth';
import {setTokens} from "../utils/storage.js";


const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { t } = useAppTheme();

    const handleLogin = async (values) => {
        console.log('Login values:', values)
        setLoading(true);
        // 前端模拟登录，实际项目请使用接口
        // setTimeout(() => {
        //     localStorage.setItem('token', 'dummy-token');
        //     message.success(t('登录成功！'));
        //     setLoading(false);
        //     navigate('/dashboard');
        // }, 800);

        //调用登录接口
        try{
            const res = await login(values);

            // 注意：根据 request.js 的拦截器，res 已经是 response.data 了
            // 后端返回结构: { accessToken: '...', refreshToken: '...' }
            const { accessToken, refreshToken } = res;

            setTokens(accessToken, refreshToken, values.rememberMe);

            message.success(t('登录成功！'));
            navigate('/dashboard');

        }  catch (error) {
            console.error('登录失败', error);
            message.error(t('登录失败！用户名或密码错误！'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card title={t('系统登录')} style={{ width: 400 }}>
                <Form name="normal_login" initialValues={{ remember: true }} onFinish={handleLogin} size="large">
                    <Form.Item name="userAccount" rules={[{ required: true, message: t('请输入用户名!') }]}>
                        <Input prefix={<UserOutlined />} placeholder={t('用户名')} />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: t('请输入密码!')}]}>
                        <Input prefix={<LockOutlined />} type="password" placeholder={t('密码')} />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="rememberMe" valuePropName="checked" noStyle>
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