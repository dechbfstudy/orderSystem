import React, {useEffect, useState} from "react";
import {Form, Input, message, Modal, Spin, Switch, Tree} from "antd";
import {createRole, getPermissionTree, updateRole} from "../api/auth.js";
import {data} from "react-router-dom";

const RoleModal = ({modalTitle, isModalOpen, setIsModalOpen, currentRecord, updateTbData}) => {
    const [modalForm] = Form.useForm();

    const [permissionSpinning, setPermissionSpinning] = useState(true)
    const [permissionTreeData, setPermissionTreeData] = useState([]);

    const [modalLoading, setModalLoading] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState([]);

    useEffect(() => {
        if (!isModalOpen) return;
        getPermissionTree().then(r => {
            setPermissionTreeData(r);
        }).catch(err => {
            console.error('加载权限树失败：', err);
            message.error('加载权限树失败，请联系管理员');
            setPermissionTreeData([]);
        }).finally(() => {
            setPermissionSpinning(false);
        });

        if (currentRecord) {
            setTimeout(() => {
                modalForm.setFieldsValue({
                    roleName: currentRecord.roleName,
                    remark: currentRecord.remark,
                    status: currentRecord.status
                });
                setCheckedKeys(currentRecord.permissionIds || []);
            }, 0);
        } else {
            setTimeout(() => {
                modalForm.resetFields();
                modalForm.setFieldsValue({status: true});
                setCheckedKeys([]);
            }, 0);
        }
    }, [isModalOpen, currentRecord]);


    // 树形控件勾选事件
    const onTreeCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
    };

    const handleModalSubmit = async () => {
        const values = await modalForm.validateFields();
        setModalLoading(true);
        if (!currentRecord) {
            const requestBody = {
                ...values,
                permissionIds: checkedKeys
            };
            createRole(requestBody).then(r => {
                if (r === 'success') {
                    message.success('角色创建成功');
                    setModalLoading(false);
                    setIsModalOpen(false);
                }
            }).catch((e) =>{
                message.error('操作失败：' + e.message);
            });
        } else {
            const requestBody = {
                ...values,
                roleId: currentRecord.key,
                permissionIds: checkedKeys
            };
            updateRole(requestBody).then(r => {
                if (r === 'success') {
                    message.success('角色修改成功');
                    setModalLoading(false);
                    setIsModalOpen(false);
                }
            }).catch((e) =>{
                message.error('操作失败：' + e.message);
            });
        }
    };

    return (
        <Modal
            title={modalTitle}
            open={isModalOpen}
            onOk={() => handleModalSubmit()}
            onCancel={() => setIsModalOpen(false)}
            loading={modalLoading}
            width={600}
            afterClose={() => updateTbData()}
        >
            <Form form={modalForm} layout="vertical" preserve={false}>
                <Form.Item
                    name="roleName"
                    label="角色名称"
                    rules={[{required: true, message: '请输入角色名称'}]}
                >
                    <Input placeholder="例如：财务专员"/>
                </Form.Item>

                <Form.Item name="remark" label="角色描述">
                    <Input.TextArea rows={2} placeholder="请输入角色职责描述"/>
                </Form.Item>

                <Form.Item label="权限配置" tooltip="勾选该角色可操作的菜单和功能">
                    <Spin spinning={permissionSpinning}>
                        <div style={{
                            border: '1px solid #d9d9d9',
                            borderRadius: 6,
                            padding: '10px',
                            maxHeight: 300,
                            overflowY: 'auto'
                        }}>
                            <Tree
                                checkable
                                defaultExpandAll
                                onCheck={onTreeCheck}
                                checkedKeys={checkedKeys}
                                treeData={permissionTreeData}
                            />
                        </div>
                    </Spin>
                </Form.Item>

                <Form.Item name="status" label="状态" valuePropName="checked">
                    <Switch checkedChildren="启用" unCheckedChildren="禁用"/>
                </Form.Item>

            </Form>
        </Modal>);
}

export default RoleModal;