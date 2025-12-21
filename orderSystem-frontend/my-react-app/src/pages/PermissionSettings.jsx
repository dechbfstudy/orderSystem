import React from 'react';
import { Card, Switch, List } from 'antd';

const PermissionSettings = () => (
    <Card title="Permissions">
        <List
            itemLayout="horizontal"
            dataSource={[{ title: 'Admin Access', desc: 'Full access to system' }, { title: 'Guest Mode', desc: 'Read only' }]}
            renderItem={(item) => (
                <List.Item actions={[<Switch defaultChecked />]}>
                    <List.Item.Meta title={item.title} description={item.desc} />
                </List.Item>
            )}
        />
    </Card>
);
export default PermissionSettings;