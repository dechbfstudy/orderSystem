import React, { useState, useEffect } from 'react';
import {
    Card, Table, Form, Input, Button,
    Space, Switch, message, Tag, Modal, Row, Col, Tree, Descriptions
} from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {enableOrDisableRole, getRoleList, login} from "../api/auth.js";
import {setTokens, setUserInfo} from "../utils/storage.js";
import RoleDetailInfoModal from "../modals/RoleDetailInfoModal.jsx";

// ==========================================
// 1. 模拟数据定义
// ==========================================

// 定义系统所有的权限树结构 (菜单 -> 操作)
const PERMISSION_TREE_DATA = [
    {
        title: '控制台 (Dashboard)',
        key: 'dashboard',
        children: [
            { title: '查看分析', key: 'dashboard:view' },
        ],
    },
    {
        title: '系统设置',
        key: 'system',
        children: [
            {
                title: '权限设置',
                key: 'system:permission',
                children: [
                    { title: '查看列表', key: 'perm:view' },
                    { title: '新增角色', key: 'perm:add' },
                    { title: '修改角色', key: 'perm:edit' },
                ]
            },
            {
                title: '菜单管理',
                key: 'system:menu',
                children: [
                    { title: '查看菜单', key: 'menu:view' },
                    { title: '编辑菜单', key: 'menu:edit' },
                ]
            },
        ],
    },
    {
        title: '用户管理',
        key: 'users',
        children: [
            { title: '查看用户', key: 'user:view' },
            { title: '新增/编辑', key: 'user:edit' },
            { title: '重置密码', key: 'user:reset' },
            { title: '启用/禁用', key: 'user:status' },
        ],
    },
    {
        title: '订单管理',
        key: 'orders',
        children: [
            { title: '查看订单', key: 'order:view' },
            { title: '创建订单', key: 'order:add' },
            { title: '审核订单', key: 'order:audit' },
            { title: '打印订单', key: 'order:print' },
        ],
    },
];

const PermissionSettings = () => {
    const [searchForm] = Form.useForm();
    const [modalForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    // --- 弹窗状态 ---
    const [isModalOpen, setIsModalOpen] = useState(false); // 新增/编辑
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 详情

    const [modalTitle, setModalTitle] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null); // 当前操作行

    // 树形控件选中的 keys
    const [checkedKeys, setCheckedKeys] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    // 1. 数据查询
    const fetchData = async (params = {}) => {
        setLoading(true);
        try{
            const res = await getRoleList(params);
            console.log(res)
            setData(res);
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
            const status = res.status;
            if (status !== checked){
                message.error(checked ? `启用角色 [${record.roleName}] 失败` : `禁用角色 [${record.roleName}] 失败`);
            }else{
                const newData = data.map(item => item.key === res.key ? { ...item, ...res} : item);
                setData(newData);
                message.success(`角色 [${record.roleName}] 已${checked ? '启用' : '禁用'}`);
            }
        } catch (error) {
            console.error('启用/禁用角色失败', error);
            message.error(checked ? `启用角色 [${record.roleName}] 失败` : `禁用角色 [${record.roleName}] 失败`);
        }
    };

    // ==========================
    // 新增 / 修改 逻辑
    // ==========================
    const handleOpenCreate = () => {
        setModalTitle('创建角色');
        setCurrentRecord(null);
        setCheckedKeys([]); // 清空权限选择
        modalForm.resetFields();
        modalForm.setFieldsValue({ status: true });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (record) => {
        setModalTitle('修改角色');
        setCurrentRecord(record);
        setCheckedKeys(record.permissions || []); // 回显权限
        modalForm.setFieldsValue({
            roleName: record.roleName,
            description: record.description,
            status: record.status
        });
        setIsModalOpen(true);
    };

    // 树形控件勾选事件
    const onTreeCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
    };

    const handleModalSubmit = async () => {
        try {
            const values = await modalForm.validateFields();
            setModalLoading(true);
            setTimeout(() => {
                const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

                if (!currentRecord) {
                    // 新增
                    const newRole = {
                        key: Date.now(),
                        ...values,
                        createTime: now,
                        updateTime: now,
                        permissions: checkedKeys // 保存选中的权限
                    };
                    setData([newRole, ...data]);
                    message.success('角色创建成功');
                } else {
                    // 修改
                    const newData = data.map(item => item.key === currentRecord.key ? {
                        ...item,
                        ...values,
                        updateTime: now,
                        permissions: checkedKeys
                    } : item);
                    setData(newData);
                    message.success('角色修改成功');
                }
                setIsModalOpen(false);
                setModalLoading(false);
            }, 800);
        } catch (e) {}
    };

    // ==========================
    // 详情 逻辑
    // ==========================
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
            render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
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
            {/* 1. 搜索区域 */}
            <Card style={{ marginBottom: 16 }}>
                <Form form={searchForm} onFinish={handleSearch}>
                    <Row gutter={[24, 16]} align="middle">
                        <Col>
                            <Form.Item label="角色名称" name="roleName" style={{ margin: 0 }}>
                                <Input placeholder="输入角色名称" allowClear style={{ width: 200 }} />
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
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
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
                    <Form.Item
                        name="roleName"
                        label="角色名称"
                        rules={[{ required: true, message: '请输入角色名称' }]}
                    >
                        <Input placeholder="例如：财务专员" />
                    </Form.Item>

                    <Form.Item name="description" label="角色描述">
                        <Input.TextArea rows={2} placeholder="请输入角色职责描述" />
                    </Form.Item>

                    <Form.Item label="权限配置" tooltip="勾选该角色可操作的菜单和功能">
                        <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: '10px', maxHeight: 300, overflowY: 'auto' }}>
                            <Tree
                                checkable
                                defaultExpandAll
                                onCheck={onTreeCheck}
                                checkedKeys={checkedKeys}
                                treeData={PERMISSION_TREE_DATA}
                            />
                        </div>
                    </Form.Item>

                    <Form.Item name="status" label="状态" valuePropName="checked">
                        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                    </Form.Item>
                </Form>
            </Modal>

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