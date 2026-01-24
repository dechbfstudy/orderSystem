import React, { useState, useEffect } from 'react';
import {
    Card, Table, Form, Input, Select, Button,
    Space, Switch, message, Tag, Modal, Radio, Row, Col
} from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    UserAddOutlined,
    EditOutlined, RedoOutlined
} from '@ant-design/icons';
import {getRoleList, getUserList} from "../api/auth.js";
import dayjs from "dayjs";

// 1. 模拟初始数据
const MOCK_DATA = Array.from({ length: 20 }).map((_, i) => ({
    key: i + 1,
    username: `用户_${i + 1}`,
    account: `admin_00${i + 1}`,
    role: i % 3 === 0 ? 'admin' : 'user',
    createTime: `2023-01-${String(i % 28 + 1).padStart(2, '0')} 10:00:00`,
    lastLoginTime: `2023-06-${String(i % 28 + 1).padStart(2, '0')} 14:30:00`,
    loginCount: Math.floor(Math.random() * 500),
    status: Math.random() > 0.3, // true: 启用, false: 禁用
}));

const UserManagement = () => {
    const [searchForm] = Form.useForm();
    const [modalForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('新增用户');
    const [modalLoading, setModalLoading] = useState(false);
    const [editingKey, setEditingKey] = useState(null);

    const [switchLoading, setSwitchLoading] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = (params = {}) => {
        setLoading(true);
        getUserList(params).then((res) => {
            setData(res);
        }).catch(e => {
            console.error('获取用户列表失败', e);
            message.error('获取用户列表失败');
        }).finally( () => {
            setLoading(false);
        });
    };

    const handleSearch = () => {
        fetchData(searchForm.getFieldsValue());
    };

    const handleReset = () => {
        searchForm.resetFields();
        fetchData({});
    };

    const handleStatusChange = (checked, record) => {
        setSwitchLoading((prev) => ({ ...prev, [record.key]: true }));
        setTimeout(() => {
            const newData = data.map((item) => item.key === record.key ? { ...item, status: checked } : item);
            setData(newData);
            setSwitchLoading((prev) => {
                const newState = { ...prev };
                delete newState[record.key];
                return newState;
            });
            message.success(`用户 [${record.username}] 已${checked ? '启用' : '禁用'}`);
        }, 600);
    };

    const handleAdd = () => {
        setEditingKey(null);
        setModalTitle('新增用户');
        setIsModalOpen(true);
        modalForm.resetFields();
        modalForm.setFieldsValue({
            status: true,
            role: 'user'
        });
    };

    const handleEdit = (record) => {
        setEditingKey(record.key);
        setModalTitle('编辑用户');
        setIsModalOpen(true);
        modalForm.setFieldsValue({
            username: record.username,
            account: record.account,
            role: record.role,
            status: record.status
        });
    };

    const handleModalOk = async () => {
        try {
            const values = await modalForm.validateFields();
            setModalLoading(true);

            setTimeout(() => {
                if (editingKey === null) {
                    const newUser = {
                        key: Date.now(),
                        username: values.username,
                        account: values.account,
                        role: values.role,
                        status: values.status,
                        createTime: new Date().toLocaleString(),
                        lastLoginTime: '-',
                        loginCount: 0,
                    };
                    setData([newUser, ...data]);
                    message.success('新增用户成功');
                } else {
                    const newData = data.map((item) => {
                        if (item.key === editingKey) {
                            return {
                                ...item,
                                username: values.username,
                                account: values.account,
                                role: values.role,
                                status: values.status
                            };
                        }
                        return item;
                    });
                    setData(newData);
                    message.success('更新用户信息成功');
                }

                setModalLoading(false);
                setIsModalOpen(false);
                modalForm.resetFields();
            }, 800);

        } catch (error) {
            console.log('Validation Failed:', error);
        }
    };

    const columns = [
        {
            title: '序号',
            key: 'index',
            width: 60,
            render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
        },
        {
            title: '账号',
            dataIndex: 'userAccount',
            key: 'userAccount',
        },
        {
            title: '角色',
            dataIndex: 'roleName',
            key: 'roleName',
            render: (text, record, index) =>
                <Tag color={record.highlightColor}>
                    {text}
                </Tag>
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 180,
            render: (text) => {
                return text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-';
            }
        },
        {
            title: '最后登录',
            dataIndex: 'lastLoginTime',
            key: 'lastLoginTime',
            width: 180,
            render: (text) => {
                return text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-';
            }
        },
        {
            title: '登录次数',
            dataIndex: 'loginCount',
            key: 'loginCount',
            align: 'center',
            render: (count) => <Tag variant='solid' color='green'>{count}</Tag>,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status, record) => (
                <Switch
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                    checked={status}
                    loading={switchLoading[record.key]}
                    onChange={(checked) => handleStatusChange(checked, record)}
                />
            ),
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        danger
                        type="link"
                        size="small"
                        icon={<RedoOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        重置密码
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '0' }}>
            {/*
         1. 搜索区域
         修改点：移除 justify="center" (默认为 start/left)，保留 align="middle"
      */}
            <Card style={{ marginBottom: 16 }}>
                <Form form={searchForm} onFinish={handleSearch}>
                    <Row gutter={[24, 16]} align="middle">
                        <Col>
                            <Form.Item label="用户名" name="username" style={{ margin: 0 }}>
                                <Input placeholder="模糊搜索" allowClear style={{ width: 160 }} disabled={loading} loading={loading}/>
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item label="账号" name="account" style={{ margin: 0 }}>
                                <Input placeholder="精确搜索" allowClear style={{ width: 160 }} disabled={loading} loading={loading}/>
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item label="状态" name="status" style={{ margin: 0 }}>
                                <Select placeholder="全部状态" allowClear style={{ width: 120 }} disabled={loading} loading={loading}>
                                    <Select.Option value={1}>启用</Select.Option>
                                    <Select.Option value={0}>禁用</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item style={{ margin: 0 }}>
                                <Space>
                                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                                        查询
                                    </Button>
                                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                                        重置
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>

            {/* 2. 表格区域 */}
            <Card
                title="用户列表"
                extra={
                    <Button type="primary" icon={<UserAddOutlined />} onClick={handleAdd} loading={loading}>
                        新增用户
                    </Button>
                }
            >
                <Table
                    rowKey="key"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{
                        ...pagination,
                        total: data.length,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条`,
                        onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                    }}
                />
            </Card>

            {/* 3. 新增/编辑 弹窗 */}

        </div>
    );
};

export default UserManagement;