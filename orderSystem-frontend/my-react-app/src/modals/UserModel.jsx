import {Form, Input, Modal, Switch} from "antd";
import {useState} from "react";

const UserModal = ({modalTitle, isModalOpen, setIsModalOpen, currentRecord, updateTbData}) => {
    const [modalForm] = Form.useForm();

    const [modalLoading, setModalLoading] = useState(false);

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