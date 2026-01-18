import {Button, Descriptions, message, Modal, Spin, Tag, Tree} from "antd";
import {SafetyCertificateOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {getPermissionTree} from "../api/auth.js";
import dayjs from "dayjs";

const RoleDetailInfoModal = ({isDetailModalOpen, setIsDetailModalOpen, currentRecord}) => {
    const [permissionSpinning, setPermissionSpinning] = useState(true)
    const [permissionTreeData, setPermissionTreeData] = useState([]);

    useEffect(() => {
        console.log('打开角色详情模态框，currentRecord:', currentRecord);
        console.log('打开角色详情模态框，isDetailModalOpen:', isDetailModalOpen);
        if (!isDetailModalOpen) return;
        console.log('打开角色详情模态框，currentRecord:', currentRecord);
        getPermissionTree().then(r => {
            setPermissionTreeData(r);
        }).catch(err => {
            console.error('加载权限树失败：', err);
            message.error('加载权限树失败，请联系管理员');
            setPermissionTreeData([]);
        }).finally(() => {
            setPermissionSpinning(false);
        });
    }, [isDetailModalOpen])

    return (

        <Modal
            title="角色详情"
            open={isDetailModalOpen}
            onCancel={() => setIsDetailModalOpen(false)}
            footer={[<Button key="close" onClick={() => setIsDetailModalOpen(false)}>关闭</Button>]}
            width={600}
        >

            {currentRecord && (
                <div>
                    <Descriptions bordered column={1} size="small" style={{marginBottom: 20}}>
                        <Descriptions.Item label="角色名称">{currentRecord.roleName}</Descriptions.Item>
                        <Descriptions.Item label="角色描述">{currentRecord.remark || '-'}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">
                            {currentRecord.createTime ? dayjs(currentRecord.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="修改时间">
                            {currentRecord.updateTime ? dayjs(currentRecord.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="当前状态">
                            <Tag color={currentRecord.status ? 'success' : 'error'}>
                                {currentRecord.status ? '启用' : '禁用'}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>

                    <div style={{fontWeight: 'bold', marginBottom: 8}}>
                        <SafetyCertificateOutlined/> 拥有权限：
                    </div>
                    <Spin spinning={permissionSpinning}>
                        <div style={{
                            border: '1px solid #f0f0f0',
                            borderRadius: 6,
                            padding: '10px',
                            background: '#fafafa',
                            maxHeight: 300,
                            overflowY: 'auto'
                        }}>
                            {/* 只读模式的 Tree：禁用交互 (disabled) */}
                            <Tree
                                checkable
                                disabled
                                defaultExpandAll
                                checkedKeys={currentRecord.permissionIds}
                                treeData={permissionTreeData}
                            />
                        </div>
                    </Spin>
                </div>
            )}

        </Modal>
    )
};

export default RoleDetailInfoModal;
