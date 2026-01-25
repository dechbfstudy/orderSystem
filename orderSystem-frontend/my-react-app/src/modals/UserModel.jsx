import {Form, Input, Modal, Select, Switch} from "antd";
import {useEffect, useState} from "react";
import {getRoleList} from "../api/auth.js";

const UserModal = ({modalTitle, isModalOpen, setIsModalOpen, currentRecord, updateTbData}) => {
    const [modalForm] = Form.useForm();

    const [modalLoading, setModalLoading] = useState(false);

    const [roleList, setRoleList] = useState([]);
    const [selectLoading, setSelectLoading] = useState(false)

    useEffect(() => {
        if (!isModalOpen) return;
        setSelectLoading(true);
        const params = {
            "status": true
        }
        getRoleList(params).then(res => {
            setRoleList(res);
        }).finally(() => {
            setSelectLoading(false);
        })

    },[isModalOpen, currentRecord])

    const handleModalSubmit = async () => {

    }

    return(
        <Modal
            title={modalTitle}
            open={isModalOpen}
            onOk={handleModalSubmit}
            onCancel={() => setIsModalOpen(false)}
            confirmLoading={modalLoading}
            width={500}
        >
            <Form form={modalForm} layout="vertical" preserve={false}>
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input placeholder="请输入用户名" />
                </Form.Item>

                <Form.Item
                    name="account"
                    label="登录账号"
                    rules={[{ required: true, message: '请输入登录账号' }]}
                >
                    <Input placeholder="请输入账号" disabled={currentRecord} />
                </Form.Item>

                <Form.Item
                    hidden={currentRecord}
                    name="password"
                    label="登录密码"
                    rules={[{ required: true, message: '请输入登录密码' }]}
                >
                    <Input.Password placeholder="请输入账号" />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="用户角色"
                    rules={[{ required: true, message: '请选择角色' }]}
                >
                    <Select placeholder="请选择角色"
                            loading={selectLoading}
                            disabled={selectLoading}
                            allowClear
                            showSearch={{ optionFilterProp: 'children'}}
                    >
                        {roleList.map(item => {
                            return <Select.Option key={item.key} value={item.key}>{item.roleName}</Select.Option>
                        })}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="账户状态"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default UserModal;