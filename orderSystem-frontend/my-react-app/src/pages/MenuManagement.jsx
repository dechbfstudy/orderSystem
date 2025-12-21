import React from 'react';
import { Table, Tag, Button } from 'antd';

const MenuManagement = () => (
    <div>
        <Button type="primary" style={{ marginBottom: 16 }}>Add Menu</Button>
        <Table
            columns={[{ title: 'Name', dataIndex: 'name' }, { title: 'Path', dataIndex: 'path' }, { title: 'Status', render:()=><Tag color="green">Active</Tag> }]}
            dataSource={[{key:1, name:'Dashboard', path:'/dashboard'}, {key:2, name:'System', path:'/system'}]}
        />
    </div>
);
export default MenuManagement;