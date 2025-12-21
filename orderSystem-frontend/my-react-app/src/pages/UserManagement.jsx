import React from 'react';
import { Table, Tag } from 'antd';

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Role', dataIndex: 'role', key: 'role', render: t => <Tag color="blue">{t}</Tag> },
    { title: 'Address', dataIndex: 'address', key: 'address' },
];
const data = [
    { key: '1', name: 'John Brown', role: 'Admin', address: 'New York No. 1 Lake Park' },
    { key: '2', name: 'Jim Green', role: 'User', address: 'London No. 1 Lake Park' },
];

const UserManagement = () => (
    <Table columns={columns} dataSource={data} />
);
export default UserManagement;