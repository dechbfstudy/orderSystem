import {Form, Input, Modal} from "antd";

const UserRestPasswordModel = ({isModalOpen, setIsModalOpen, currentRecord}) => {
    const [modalForm] = Form.useForm();

    const handleModalSubmit = async () => {

    }

    return(
        <Modal
            title="重置用户密码"
            open={isModalOpen}
            onOk={()=>handleModalSubmit()}
            onCancel={() => setIsModalOpen(false)}
            width={500}
        >
            <Form form={modalForm} layout="horizontal" preserve={false}>
                <Form.Item
                    name="password"
                    label="重置密码"
                    rules={[{ required: true, message: '请输入用户登录密码' }]}
                >
                    <Input.Password placeholder="请输入用户登录密码" />
                </Form.Item>
            </Form>
        </Modal>)
}

export default UserRestPasswordModel;