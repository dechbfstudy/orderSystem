import React from 'react';
import { Table } from 'antd';

const OrderManagement = () => (
    <Table
        columns={[{ title: 'Order ID', dataIndex: 'id' }, { title: 'Amount', dataIndex: 'amount' }]}
        dataSource={[{key:1, id:'ORD-001', amount: '$120.00'}, {key:2, id:'ORD-002', amount: '$88.50'}]}
    />
);
export default OrderManagement;