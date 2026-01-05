import React, { useState, useEffect, useRef } from 'react';
import {
    Card, Table, Form, Input, Button, DatePicker,
    Space, Tag, Modal, Row, Col, Select, Descriptions, message
} from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    CheckSquareOutlined,
    ExclamationCircleOutlined,
    PrinterOutlined // 引入打印图标
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 1. 模拟数据生成器
const MOCK_DATA = Array.from({ length: 50 }).map((_, i) => {
    const statusList = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
    const status = statusList[Math.floor(Math.random() * statusList.length)];
    return {
        key: i + 1,
        orderId: `ORD-${dayjs().format('YYYYMMDD')}-${String(i + 1).padStart(4, '0')}`,
        operator: `员工_${Math.floor(Math.random() * 10) + 1}`,
        createTime: dayjs().subtract(Math.floor(Math.random() * 5), 'day').format('YYYY-MM-DD HH:mm:ss'),
        amount: (Math.random() * 1000).toFixed(2),
        status: status,
        customer: `客户公司_${String.fromCharCode(65 + i % 26)}`,
    };
});

const OrderManagement = () => {
    const [searchForm] = Form.useForm();
    const [orderForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    // --- 弹窗状态 ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

    const [modalTitle, setModalTitle] = useState('');
    const [currentRecord, setCurrentRecord] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const autoRefreshTimer = useRef(null);

    useEffect(() => {
        // 1. 默认时间范围：昨天 ~ 今天
        const defaultStart = dayjs().subtract(1, 'day');
        const defaultEnd = dayjs();
        searchForm.setFieldsValue({
            dateRange: [defaultStart, defaultEnd]
        });

        handleSearch();
        startAutoRefresh();

        return () => stopAutoRefresh();
    }, []);

    const startAutoRefresh = () => {
        stopAutoRefresh();
        autoRefreshTimer.current = setInterval(() => {
            handleSearch(false);
        }, 5 * 60 * 1000); // 5分钟
    };

    const stopAutoRefresh = () => {
        if (autoRefreshTimer.current) clearInterval(autoRefreshTimer.current);
    };

    const fetchData = (params = {}, showLoading = true) => {
        if (showLoading) setLoading(true);

        setTimeout(() => {
            let filtered = [...MOCK_DATA];

            if (params.orderId) {
                filtered = filtered.filter(item => item.orderId.includes(params.orderId));
            }
            if (params.operator) {
                filtered = filtered.filter(item => item.operator.includes(params.operator));
            }
            // 日期筛选
            if (params.dateRange && params.dateRange.length === 2) {
                // startOf('day') 会自动把时间设为 00:00:00，endOf('day') 设为 23:59:59
                const start = params.dateRange[0].startOf('day').valueOf();
                const end = params.dateRange[1].endOf('day').valueOf();
                filtered = filtered.filter(item => {
                    const time = dayjs(item.createTime).valueOf();
                    return time >= start && time <= end;
                });
            }

            setData(filtered);
            if (showLoading) setLoading(false);
            startAutoRefresh();
        }, 600);
    };

    const handleSearch = (showLoading = true) => {
        const values = searchForm.getFieldsValue();
        fetchData(values, showLoading);
    };

    const handleReset = () => {
        searchForm.resetFields();
        const defaultStart = dayjs().subtract(1, 'day');
        const defaultEnd = dayjs();
        searchForm.setFieldsValue({
            dateRange: [defaultStart, defaultEnd]
        });
        handleSearch();
    };

    // --- 增删改查逻辑 ---
    const handleOpenCreate = () => {
        setModalTitle('创建订单');
        setCurrentRecord(null);
        setIsEditModalOpen(true);
        orderForm.resetFields();
        orderForm.setFieldsValue({
            createTime: dayjs(),
            status: 'pending'
        });
    };

    const handleOpenEdit = (record) => {
        setModalTitle('修改订单');
        setCurrentRecord(record);
        setIsEditModalOpen(true);
        orderForm.setFieldsValue({
            ...record,
            createTime: dayjs(record.createTime)
        });
    };

    const handleEditSubmit = async () => {
        try {
            const values = await orderForm.validateFields();
            setModalLoading(true);
            setTimeout(() => {
                const formattedTime = values.createTime.format('YYYY-MM-DD HH:mm:ss');

                if (!currentRecord) {
                    const newOrder = {
                        key: Date.now(),
                        orderId: `ORD-${dayjs().format('YYYYMMDD')}-${Math.floor(Math.random()*1000)}`,
                        ...values,
                        createTime: formattedTime
                    };
                    setData([newOrder, ...data]);
                    message.success('订单创建成功');
                } else {
                    const newData = data.map(item => item.key === currentRecord.key ? { ...item, ...values, createTime: formattedTime } : item);
                    setData(newData);
                    message.success('订单修改成功');
                }
                setIsEditModalOpen(false);
                setModalLoading(false);
            }, 800);
        } catch (e) {}
    };

    const handleOpenDetail = (record) => {
        setCurrentRecord(record);
        setIsDetailModalOpen(true);
    };

    // --- 打印逻辑 ---
    const handlePrintOrder = () => {
        // 简单模拟打印
        message.loading('正在准备打印预览...', 1).then(() => {
            window.print();
        });
    };

    const handleOpenAudit = (record) => {
        setCurrentRecord(record);
        setIsAuditModalOpen(true);
    };

    const handleAuditSubmit = (pass) => {
        setModalLoading(true);
        setTimeout(() => {
            const newStatus = pass ? 'paid' : 'cancelled';
            const newData = data.map(item => item.key === currentRecord.key ? { ...item, status: newStatus } : item);
            setData(newData);
            message.success(pass ? '审核通过' : '审核驳回');
            setIsAuditModalOpen(false);
            setModalLoading(false);
        }, 800);
    };

    const getStatusTag = (status) => {
        const config = {
            pending: { color: 'gold', text: '待审核' },
            paid: { color: 'blue', text: '已支付' },
            shipped: { color: 'cyan', text: '已发货' },
            completed: { color: 'green', text: '已完成' },
            cancelled: { color: 'red', text: '已取消' },
        };
        const conf = config[status] || { color: 'default', text: status };
        return <Tag color={conf.color}>{conf.text}</Tag>;
    };

    const columns = [
        {
            title: '序号',
            width: 60,
            render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: '订单编号',
            dataIndex: 'orderId',
            key: 'orderId',
            copyable: true,
            render: text => <b>{text}</b>
        },
        {
            title: '客户名称',
            dataIndex: 'customer',
            key: 'customer',
            ellipsis: true,
        },
        {
            title: '开单员',
            dataIndex: 'operator',
            key: 'operator',
        },
        {
            title: '开单日期',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 170,
        },
        {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            render: val => `¥ ${Number(val).toLocaleString()}`,
        },
        {
            title: '订单状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: status => getStatusTag(status),
        },
        {
            title: '操作',
            key: 'action',
            width: 250,
            render: (_, record) => (
                <Space>
                    <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleOpenDetail(record)}>
                        详情
                    </Button>
                    <Button
                        type="link" size="small" icon={<EditOutlined />}
                        onClick={() => handleOpenEdit(record)}
                        disabled={record.status !== 'pending'}
                    >
                        修改
                    </Button>
                    <Button
                        type="link" size="small" icon={<CheckSquareOutlined />}
                        onClick={() => handleOpenAudit(record)}
                        disabled={record.status !== 'pending'}
                    >
                        审核
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '0' }}>
            {/* 搜索区域 */}
            <Card style={{ marginBottom: 16 }}>
                <Form form={searchForm} onFinish={() => handleSearch(true)}>
                    <Row gutter={[24, 16]} align="middle">
                        <Col>
                            <Form.Item label="订单编号" name="orderId" style={{ margin: 0 }}>
                                <Input placeholder="输入编号" allowClear style={{ width: 160 }} />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item label="开单员" name="operator" style={{ margin: 0 }}>
                                <Input placeholder="输入姓名" allowClear style={{ width: 140 }} />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item label="日期范围" name="dateRange" style={{ margin: 0 }}>
                                {/* 修改点：移除了 showTime，现在只选日期 */}
                                <RangePicker
                                    style={{ width: 260 }}
                                    presets={[
                                        { label: '昨天', value: [dayjs().subtract(1, 'd'), dayjs().subtract(1, 'd')] },
                                        { label: '最近7天', value: [dayjs().subtract(7, 'd'), dayjs()] },
                                    ]}
                                />
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

            {/* 表格区域 */}
            <Card
                title="订单列表"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
                        创建订单
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

            {/* 弹窗 A: 新增/修改 */}
            <Modal
                title={modalTitle}
                open={isEditModalOpen}
                onOk={handleEditSubmit}
                onCancel={() => setIsEditModalOpen(false)}
                confirmLoading={modalLoading}
                width={600}
                destroyOnClose
            >
                <Form form={orderForm} layout="vertical" preserve={false}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="customer" label="客户名称" rules={[{ required: true }]}>
                                <Input placeholder="请输入客户名称" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="operator" label="开单员" rules={[{ required: true }]}>
                                <Input placeholder="请输入开单员" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="amount" label="订单金额" rules={[{ required: true }]}>
                                <Input prefix="¥" type="number" placeholder="0.00" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="createTime" label="开单日期" rules={[{ required: true }]}>
                                <DatePicker showTime style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="status" label="初始状态">
                        <Select>
                            <Option value="pending">待审核</Option>
                            <Option value="paid">已支付</Option>
                            <Option value="completed">已完成</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 弹窗 B: 订单详情 (修改点：增加了打印按钮) */}
            <Modal
                title="订单详情"
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                width={700}
                footer={[
                    // 修改点：增加了打印按钮
                    <Button key="print" icon={<PrinterOutlined />} onClick={handlePrintOrder}>
                        打印订单
                    </Button>,
                    <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
                        关闭
                    </Button>
                ]}
            >
                {currentRecord && (
                    <div id="print-area">
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="订单编号">{currentRecord.orderId}</Descriptions.Item>
                            <Descriptions.Item label="订单状态">{getStatusTag(currentRecord.status)}</Descriptions.Item>
                            <Descriptions.Item label="客户名称">{currentRecord.customer}</Descriptions.Item>
                            <Descriptions.Item label="开单员">{currentRecord.operator}</Descriptions.Item>
                            <Descriptions.Item label="开单时间">{currentRecord.createTime}</Descriptions.Item>
                            <Descriptions.Item label="订单金额">¥ {Number(currentRecord.amount).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="备注" span={2}>
                                这是一条模拟的订单备注信息，展示详情使用。
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </Modal>

            {/* 弹窗 C: 审核订单 */}
            <Modal
                title={
                    <span><ExclamationCircleOutlined style={{ color: '#1677ff', marginRight: 8 }}/>审核订单</span>
                }
                open={isAuditModalOpen}
                onCancel={() => setIsAuditModalOpen(false)}
                footer={null}
                width={400}
            >
                <p style={{ margin: '20px 0', fontSize: '15px' }}>
                    当前订单号：<b>{currentRecord?.orderId}</b><br/>
                    请确认该订单信息是否无误？
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <Button onClick={() => setIsAuditModalOpen(false)}>取消</Button>
                    <Button danger loading={modalLoading} onClick={() => handleAuditSubmit(false)}>驳回</Button>
                    <Button type="primary" loading={modalLoading} onClick={() => handleAuditSubmit(true)}>通过</Button>
                </div>
            </Modal>
        </div>
    );
};

export default OrderManagement;