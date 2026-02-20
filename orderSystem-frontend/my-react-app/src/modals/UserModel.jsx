import {Form, Input, message, Modal, Select, Switch} from "antd";
import {useEffect, useState} from "react";
import {createUser, getRoleList} from "../api/auth.js";

const UserModal = ({modalTitle, isModalOpen, setIsModalOpen, currentRecord, updateTbData}) => {
    const [modalForm] = Form.useForm();

    const [modalLoading, setModalLoading] = useState(false);

    const [roleList, setRoleList] = useState([]);
    const [selectLoading, setSelectLoading] = useState(false)

    useEffect(() => {
        if (!isModalOpen) return;
        setSelectLoading(true);
        //获取权限列表
        const params = {
            "status": true
        }
        getRoleList(params).then(res => {
            setRoleList(res.data);
        }).finally(() => {
            setSelectLoading(false);
        })
        //判断回填参数
        if (currentRecord) {

        }else{
            modalForm.resetFields();
            modalForm.setFieldsValue({status: true});
        }

    },[isModalOpen, currentRecord])

    const handleModalSubmit = async () => {
        const values = await modalForm.validateFields();
        console.log('values:', values)
        setModalLoading(true);
        if (currentRecord) {

        }else{
            createUser(values).then(r => {
                if (r.code === 200){
                    message.success('用户创建成功');
                    setModalLoading(false);
                    setIsModalOpen(false);
                }else {
                    message.error(r.message);
                    setModalLoading(false);
                }
            }).catch(e =>{
                message.error('操作失败：' + e.message);
                setModalLoading(false);
                setIsModalOpen(false);
            })
        }
    }

    return(
        <Modal
            title={modalTitle}
            open={isModalOpen}
            onOk={handleModalSubmit}
            onCancel={() => setIsModalOpen(false)}
            loading={modalLoading}
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
                    name="userAccount"
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
                    name="roleId"
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