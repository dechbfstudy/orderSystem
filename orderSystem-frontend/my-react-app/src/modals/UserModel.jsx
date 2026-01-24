const UserModal = ({modalTitle, isModalOpen, setIsModalOpen, currentRecord, updateTbData}) => {

    return(<></>
        // <Modal
        //     title={modalTitle}
        //     open={isModalOpen}
        //     onOk={handleModalOk}
        //     onCancel={() => setIsModalOpen(false)}
        //     confirmLoading={modalLoading}
        //     width={500}
        //     destroyOnClose
        // >
        //     <Form form={modalForm} layout="vertical" preserve={false}>
        //         <Form.Item
        //             name="username"
        //             label="用户名"
        //             rules={[{ required: true, message: '请输入用户名' }]}
        //         >
        //             <Input placeholder="请输入用户名" />
        //         </Form.Item>
        //
        //         <Form.Item
        //             name="account"
        //             label="登录账号"
        //             rules={[{ required: true, message: '请输入登录账号' }]}
        //         >
        //             <Input placeholder="请输入账号" disabled={editingKey !== null} />
        //         </Form.Item>
        //
        //         <Form.Item
        //             name="role"
        //             label="用户角色"
        //             rules={[{ required: true, message: '请选择角色' }]}
        //         >
        //             <Radio.Group>
        //                 <Radio value="user">普通用户</Radio>
        //                 <Radio value="admin">管理员</Radio>
        //             </Radio.Group>
        //         </Form.Item>
        //
        //         <Form.Item
        //             name="status"
        //             label="账户状态"
        //             valuePropName="checked"
        //         >
        //             <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        //         </Form.Item>
        //     </Form>
        // </Modal>
    )
}

export default UserModal;