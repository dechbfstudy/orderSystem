import React, { useState, useEffect } from 'react';
import {
    Card, Table, Form, Input, Button,
    Space, Modal, Row, Col, Tag, message, Popconfirm, Divider
} from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    MinusCircleOutlined
} from '@ant-design/icons';

// 1. 模拟数据生成
const MOCK_DATA = Array.from({ length: 20 }).map((_, i) => ({
    key: i + 1,
    name: `客户王总_${i + 1}`,
    // 模拟多个电话
    phones: i % 2 === 0 ? ['13800138000'] : ['13900001111', '0755-12345678'],
    // 模拟多个地址
    addresses: i % 2 === 0
        ? ['广东省深圳市南山区科技园']
        : ['上海市浦东新区陆家嘴金融中心', '北京市朝阳区国贸大厦'],
    orderCount: Math.floor(Math.random() * 50), // 下单次数
}));

const CustomerManagement = () => {
    const [searchForm] = Form.useForm();
    const [modalForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    // --- 弹窗状态 ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [editingKey, setEditingKey] = useState(null); // null=新增, value=编辑

    useEffect(() => {
        fetchData();
    }, []);

    // 模拟搜索请求
    const fetchData = (params = {}) => {
        setLoading(true);
        setTimeout(() => {
            let filtered = [...MOCK_DATA];

            // 1. 姓名搜索
            if (params.name) {
                filtered = filtered.filter(item => item.name.includes(params.name));
            }
            // 2. 电话搜索 (数组中只要有一个匹配即可)
            if (params.phone) {
                filtered = filtered.filter(item =>
                    item.phones.some(p => p.includes(params.phone))
                );
            }
            // 3. 地址搜索 (数组中只要有一个匹配即可)
            if (params.address) {
                filtered = filtered.filter(item =>
                    item.addresses.some(addr => addr.includes(params.address))
                );
            }

            setData(filtered);
            setLoading(false);
        }, 500);
    };

    const handleSearch = () => {
        fetchData(searchForm.getFieldsValue());
    };

    const handleReset = () => {
        searchForm.resetFields();
        fetchData({});
    };

    // ==========================
    // 新增 / 编辑 逻辑
    // ==========================
    const handleOpenCreate = () => {
        setModalTitle('创建客户');
        setEditingKey(null);
        setIsModalOpen(true);
        modalForm.resetFields();
        // 设置默认值，保证 Form.List 至少有一行
        modalForm.setFieldsValue({
            phones: [''],
            addresses: ['']
        });
    };

    const handleOpenEdit = (record) => {
        setModalTitle('编辑客户');
        setEditingKey(record.key);
        setIsModalOpen(true);
        // 回显数据
        modalForm.setFieldsValue({
            name: record.name,
            phones: record.phones,
            addresses: record.addresses
        });
    };

    const handleModalSubmit = async () => {
        try {
            const values = await modalForm.validateFields();
            setModalLoading(true);

            setTimeout(() => {
                // 过滤掉空值 (防止用户添加了输入框但没填内容)
                const cleanPhones = values.phones.filter(p => p && p.trim() !== '');
                const cleanAddresses = values.addresses.filter(a => a && a.trim() !== '');

                if (cleanPhones.length === 0) {
                    message.warning('请至少填写一个联系电话');
                    setModalLoading(false);
                    return;
                }

                const finalData = {
                    ...values,
                    phones: cleanPhones,
                    addresses: cleanAddresses
                };

                if (editingKey === null) {
                    // --- 新增 ---
                    const newItem = {
                        key: Date.now(),
                        ...finalData,
                        orderCount: 0, // 新客户默认为0
                    };
                    setData([newItem, ...data]);
                    message.success('客户创建成功');
                } else {
                    // --- 编辑 ---
                    const newData = data.map(item => item.key === editingKey ? { ...item, ...finalData } : item);
                    setData(newData);
                    message.success('客户信息更新成功');
                }

                setModalLoading(false);
                setIsModalOpen(false);
                modalForm.resetFields();
            }, 800);
        } catch (e) {
            console.log('Validate Failed:', e);
        }
    };

    // 删除逻辑 (可选)
    const handleDelete = (key) => {
        const newData = data.filter(item => item.key !== key);
        setData(newData);
        message.success('删除成功');
    };

    // ==========================
    // 表格配置
    // ==========================
    const columns = [
        {
            title: '序号',
            width: 60,
            render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: '客户姓名',
            dataIndex: 'name',
            key: 'name',
            render: text => <b>{text}</b>
        },
        {
            title: '联系电话',
            dataIndex: 'phones',
            key: 'phones',
            width: 200,
            render: (phones) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {phones.map((phone, idx) => (
                        <Tag key={idx} color="blue" icon={<PhoneOutlined />}>
                            {phone}
                        </Tag>
                    ))}
                </div>
            )
        },
        {
            title: '送货地址',
            dataIndex: 'addresses',
            key: 'addresses',
            render: (addrs) => (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {addrs.map((addr, idx) => (
                        <li key={idx} style={{ marginBottom: 2 }}>{addr}</li>
                    ))}
                </ul>
            )
        },
        {
            title: '下单次数',
            dataIndex: 'orderCount',
            key: 'orderCount',
            align: 'center',
            width: 100,
            render: count => <Tag color={count > 10 ? 'green' : 'default'}>{count}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenEdit(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm title="确认删除该客户吗？" onConfirm={() => handleDelete(record.key)}>
                        <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '0' }}>
            {/* 1. 搜索区域 */}
            <Card style={{ marginBottom: 16 }}>
                <Form form={searchForm} onFinish={handleSearch}>
                    <Row gutter={[24, 16]} align="middle">
                        <Col>
                            <Form.Item label="客户姓名" name="name" style={{ margin: 0 }}>
                                <Input placeholder="输入姓名" allowClear style={{ width: 160 }} />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item label="电话" name="phone" style={{ margin: 0 }}>
                                <Input placeholder="输入电话" allowClear style={{ width: 160 }} />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item label="地址" name="address" style={{ margin: 0 }}>
                                <Input placeholder="输入地址关键词" allowClear style={{ width: 180 }} />
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
                title="客户列表"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
                        创建客户
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
                        showTotal: (total) => `共 ${total} 条`,
                        onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                    }}
                />
            </Card>

            {/* 3. 新增/编辑 弹窗 */}
            <Modal
                title={modalTitle}
                open={isModalOpen}
                onOk={handleModalSubmit}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={modalLoading}
                width={600}
                destroyOnClose
            >
                <Form form={modalForm} layout="vertical" preserve={false}>
                    {/* 姓名 */}
                    <Form.Item
                        name="name"
                        label="客户姓名"
                        rules={[{ required: true, message: '请输入客户姓名' }]}
                    >
                        <Input placeholder="请输入客户姓名" />
                    </Form.Item>

                    {/* 动态电话列表 */}
                    <Form.List name="phones">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        required={false}
                                        key={field.key}
                                        label={index === 0 ? '联系电话' : ''}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Row gutter={8}>
                                            <Col flex="auto">
                                                <Form.Item
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    rules={[{ required: true, whitespace: true, message: "请输入电话或删除此行" }]}
                                                    noStyle
                                                >
                                                    <Input placeholder="电话号码" prefix={<PhoneOutlined style={{color:'#ccc'}}/>} />
                                                </Form.Item>
                                            </Col>
                                            <Col flex="none">
                                                {/* 第一行如果不想让删除，可以加判断 */}
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(field.name)}
                                                    style={{ fontSize: '20px', color: '#ff4d4f', cursor: 'pointer', marginTop: 6 }}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        添加电话
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Divider style={{ margin: '10px 0 20px 0' }} />

                    {/* 动态地址列表 */}
                    <Form.List name="addresses">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        required={false}
                                        key={field.key}
                                        label={index === 0 ? '收货地址' : ''}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Row gutter={8}>
                                            <Col flex="auto">
                                                <Form.Item
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    rules={[{ required: true, whitespace: true, message: "请输入地址或删除此行" }]}
                                                    noStyle
                                                >
                                                    <Input placeholder="输入详细地址" prefix={<EnvironmentOutlined style={{color:'#ccc'}}/>} />
                                                </Form.Item>
                                            </Col>
                                            <Col flex="none">
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(field.name)}
                                                    style={{ fontSize: '20px', color: '#ff4d4f', cursor: 'pointer', marginTop: 6 }}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        添加地址
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                </Form>
            </Modal>
        </div>
    );
};

export default CustomerManagement;