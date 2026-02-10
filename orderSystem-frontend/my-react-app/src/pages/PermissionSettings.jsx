import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Input, message, Row, Select, Space, Switch, Table, Tag} from 'antd';
import {EditOutlined, EyeOutlined, PlusOutlined, ReloadOutlined, SearchOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import {enableOrDisableRole, getRoleList} from "../api/auth.js";
import RoleDetailInfoModal from "../modals/RoleDetailInfoModal.jsx";
import RoleModal from "../modals/RoleModal.jsx";

const PermissionSettings = () => {
    const [searchForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    // --- 弹窗状态 ---
    const [isModalOpen, setIsModalOpen] = useState(false); // 新增/编辑
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 详情

    const [modalTitle, setModalTitle] = useState('');
    const [currentRecord, setCurrentRecord] = useState(null); // 当前操作行

    useEffect(() => {
        fetchData();
    }, []);

    // 1. 数据查询
    const fetchData = async (params = {}) => {
        setLoading(true);
        try{
            const res = await getRoleList(params);
            setData(res.data);
        }  catch (error) {
            console.error('获取角色列表失败', error);
            message.error('获取角色列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchData(searchForm.getFieldsValue()).then(r => {});
    };

    const handleReset = () => {
        searchForm.resetFields();
        fetchData();
    };

    // 2. 状态切换
    const handleStatusChange = async (checked, record) => {
        try {
            const requestData = {
                roleId: record.key,
                status: checked
            };

            const res = await enableOrDisableRole(requestData);
            const status = res.data.status;
            if (status !== checked){
                message.error(checked ? `启用角色 [${record.roleName}] 失败` : `禁用角色 [${record.roleName}] 失败`);
            }else{
                const newData = data.map(item => item.key === res.data.key ? { ...item, ...res.data} : item);
                setData(newData);
                message.success(`角色 [${record.roleName}] 已${checked ? '启用' : '禁用'}`);
            }
        } catch (error) {
            console.error('启用/禁用角色失败', error);
            message.error(checked ? `启用角色 [${record.roleName}] 失败` : `禁用角色 [${record.roleName}] 失败`);
        }
    };

    const handleOpenCreate = () => {
        setModalTitle('创建角色');
        setCurrentRecord(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (record) => {
        setModalTitle('修改角色');
        setCurrentRecord(record);
        setIsModalOpen(true);
    };

    const handleOpenDetail = (record) => {
        setCurrentRecord(record);
        setIsDetailModalOpen(true);
    };

    const columns = [
        {
            title: '序号',
            render: (text, record, index) => index + 1,
            width: 60,
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
            render: (text, record, index) =>
                <Tag color={record.highlightColor}>
                    {text}
                </Tag>
        },
        {
            title: '描述',
            dataIndex: 'remark',
            key: 'remark',
            ellipsis: true,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 170,
            render: (text) => {
                return text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-';
            }
        },
        {
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 170,
            render: (text) => {
                return text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-';
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Switch
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                    checked={status}
                    onChange={(checked) => handleStatusChange(checked, record)}
                />
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 180,
            render: (_, record) => (
                <Space>
                    <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleOpenDetail(record)}>
                        详情
                    </Button>
                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)}>
                        修改
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '0' }}>
            <Card style={{ marginBottom: 16 }}>
                <Form form={searchForm} onFinish={handleSearch}>
                    <Row gutter={[24, 16]} align="middle">
                        <Col>
                            <Form.Item label="角色名称" name="roleName" style={{ margin: 0 }}>
                                <Input placeholder="输入角色名称" allowClear style={{ width: 200 }} loading={loading} disabled={loading}/>
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
                title="角色列表"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate} loading={loading}>
                        创建角色
                    </Button>
                }
            >
                <Table
                    rowKey="key"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* --- 弹窗 A: 新增/修改 --- */}
            <RoleModal
                modalTitle={modalTitle}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                currentRecord={currentRecord}
                updateTbData={() => handleSearch()}
            />

            {/* --- 弹窗 B: 详情 --- */}
            <RoleDetailInfoModal
                isDetailModalOpen={isDetailModalOpen}
                setIsDetailModalOpen={setIsDetailModalOpen}
                currentRecord={currentRecord}
            />
        </div>
    );
};

export default PermissionSettings;