import React, { useState, useEffect, useRef } from 'react';
import {
    Card, Table, Form, Input, Button, DatePicker,
    Space, Tag, Modal, Row, Col, Select, message, InputNumber
} from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    CheckSquareOutlined,
    ExclamationCircleOutlined,
    PrinterOutlined,
    MinusCircleOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// ==========================================
// 1. 模拟数据
// ==========================================
const MOCK_DATA = Array.from({ length: 20 }).map((_, i) => {
    const statusList = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
    return {
        key: i + 1,
        orderId: `YX-${dayjs().format('YYYY')}-${String(i + 1).padStart(4, '0')}`,
        customer: `客户_${String.fromCharCode(65 + i % 26)}老板`,
        phone: `138${Math.floor(Math.random()*100000000)}`,
        address: '信宜市市区某某路88号',
        operator: `业务员_${i % 5 + 1}`,
        createTime: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
        deliveryTime: dayjs().add(10, 'day').format('YYYY-MM-DD'),
        deliveryMethod: i % 2 === 0 ? '送货上门' : '自提',
        note: i % 3 === 0 ? '加急订单，玻璃要钢化' : '',
        status: statusList[i % 5],
        deposit: 500,
        amount: 0,
        products: [
            {
                size: '2100*900*280', style: '简约平板', color: '红胡桃',
                open: '左内', lock: '指纹锁', foot: '不锈钢',
                qty: 1, unit: '套', price: 1200, remark: '卧室'
            },
            {
                size: '2100*800*280', style: '大玻璃', color: '白橡木',
                open: '右外', lock: '机械锁', foot: '无',
                qty: 2, unit: '套', price: 950, remark: '卫生间'
            }
        ]
    };
});

MOCK_DATA.forEach(item => {
    item.amount = item.products.reduce((sum, p) => sum + (p.price * p.qty), 0);
});

const OrderManagement = () => {
    const [searchForm] = Form.useForm();
    const [orderForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

    const [modalTitle, setModalTitle] = useState('');
    const [currentRecord, setCurrentRecord] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const autoRefreshTimer = useRef(null);

    useEffect(() => {
        const defaultStart = dayjs().subtract(1, 'day');
        const defaultEnd = dayjs();
        searchForm.setFieldsValue({ dateRange: [defaultStart, defaultEnd] });

        handleSearch();
        startAutoRefresh();
        return () => stopAutoRefresh();
    }, []);

    const startAutoRefresh = () => {
        stopAutoRefresh();
        autoRefreshTimer.current = setInterval(() => handleSearch(false), 5 * 60 * 1000);
    };

    const stopAutoRefresh = () => {
        if (autoRefreshTimer.current) clearInterval(autoRefreshTimer.current);
    };

    const fetchData = (params = {}, showLoading = true) => {
        if (showLoading) setLoading(true);
        setTimeout(() => {
            let filtered = [...MOCK_DATA];
            if (params.orderId) filtered = filtered.filter(item => item.orderId.includes(params.orderId));
            if (params.operator) filtered = filtered.filter(item => item.operator.includes(params.operator));
            if (params.dateRange && params.dateRange.length === 2) {
                const start = params.dateRange[0].startOf('day').valueOf();
                const end = params.dateRange[1].endOf('day').valueOf();
                filtered = filtered.filter(item => {
                    const time = dayjs(item.createTime).valueOf();
                    return time >= start && time <= end;
                });
            }
            setData(filtered);
            if (showLoading) setLoading(false);
            startAutoRefresh();
        }, 500);
    };

    const handleSearch = (showLoading = true) => {
        fetchData(searchForm.getFieldsValue(), showLoading);
    };

    const handleReset = () => {
        searchForm.resetFields();
        handleSearch();
    };

    // --- 新增/修改 ---
    const handleOpenCreate = () => {
        setModalTitle('创建订单');
        setCurrentRecord(null);
        setIsEditModalOpen(true);
        orderForm.resetFields();
        orderForm.setFieldsValue({
            createTime: dayjs(),
            deliveryTime: dayjs().add(7, 'day'),
            status: 'pending',
            deliveryMethod: '送货上门',
            products: [{ qty: 1, unit: '套', price: 0 }],
            deposit: 0
        });
    };

    const handleOpenEdit = (record) => {
        setModalTitle('修改订单');
        setCurrentRecord(record);
        setIsEditModalOpen(true);
        orderForm.setFieldsValue({
            ...record,
            createTime: dayjs(record.createTime),
            deliveryTime: dayjs(record.deliveryTime),
        });
    };

    const handleEditSubmit = async () => {
        try {
            const values = await orderForm.validateFields();
            setModalLoading(true);
            const products = values.products || [];
            const totalAmount = products.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.qty || 0)), 0);

            setTimeout(() => {
                const formattedData = {
                    ...values,
                    amount: totalAmount,
                    createTime: values.createTime.format('YYYY-MM-DD'),
                    deliveryTime: values.deliveryTime ? values.deliveryTime.format('YYYY-MM-DD') : '',
                };

                if (!currentRecord) {
                    const newOrder = {
                        key: Date.now(),
                        orderId: `YX-${dayjs().format('YYYY')}-${Math.floor(Math.random()*1000)}`,
                        ...formattedData
                    };
                    setData([newOrder, ...data]);
                    message.success('订单创建成功');
                } else {
                    const newData = data.map(item => item.key === currentRecord.key ? { ...item, ...formattedData } : item);
                    setData(newData);
                    message.success('订单修改成功');
                }
                setIsEditModalOpen(false);
                setModalLoading(false);
            }, 600);
        } catch (e) { console.log(e); }
    };

    // --- 详情/打印/审核 ---
    const handleOpenDetail = (record) => {
        setCurrentRecord(record);
        setIsDetailModalOpen(true);
    };

    const handlePrintOrder = () => {
        const printContent = document.getElementById('print-area').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    const handleOpenAudit = (record) => {
        setCurrentRecord(record);
        setIsAuditModalOpen(true);
    };

    const handleAuditSubmit = (pass) => {
        setModalLoading(true);
        setTimeout(() => {
            const newStatus = pass ? 'paid' : 'cancelled';
            const newData = data.map(item => item.key === currentRecord.key ? { ...item, status: newStatus } : item);
            setData(newData);
            message.success('操作成功');
            setIsAuditModalOpen(false);
            setModalLoading(false);
        }, 600);
    };

    const getStatusTag = (status) => {
        const config = {
            pending: { color: 'gold', text: '待审核' },
            paid: { color: 'blue', text: '已支付' },
            shipped: { color: 'cyan', text: '已发货' },
            completed: { color: 'green', text: '已完成' },
            cancelled: { color: 'red', text: '已取消' },
        };
        const conf = config[status] || { color: 'default', text: status };
        return <Tag color={conf.color}>{conf.text}</Tag>;
    };

    // ==========================================
    // 打印单样式 (CSS-in-JS) - 修复对齐
    // ==========================================
    const printStyles = {
        container: { fontFamily: '"SimSun", "Songti SC", serif', color: '#000', padding: '10px', background: '#fff' },
        header: { textAlign: 'center', marginBottom: '10px' },
        title: { fontSize: '24px', fontWeight: 'bold', margin: '5px 0', letterSpacing: '2px' },
        subTitle: { fontSize: '16px', margin: '5px 0', fontWeight: 'bold' },
        // 关键：fixed 布局，确保列宽不乱跑
        table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', tableLayout: 'fixed' },
        td: { border: '1px solid #000', padding: '6px 2px', textAlign: 'center', height: '36px', wordBreak: 'break-all' },
        labelTd: { fontWeight: 'bold', backgroundColor: '#f9f9f9' },
        noticeBox: { textAlign: 'left', fontSize: '12px', lineHeight: '1.5', padding: '8px', verticalAlign: 'top' },
        noticeTitle: { fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }
    };

    const columns = [
        { title: '序号', width: 60, render: (t,r,i) => i+1 },
        { title: '订单编号', dataIndex: 'orderId', copyable: true, render: t => <b>{t}</b> },
        { title: '客户名称', dataIndex: 'customer' },
        { title: '负责人', dataIndex: 'operator' },
        { title: '接单日期', dataIndex: 'createTime', width: 110 },
        { title: '金额', dataIndex: 'amount', render: v => `¥${Number(v).toLocaleString()}` },
        { title: '状态', dataIndex: 'status', align: 'center', render: s => getStatusTag(s) },
        {
            title: '操作', width: 220,
            render: (_, record) => (
                <Space>
                    <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleOpenDetail(record)}>详情</Button>
                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} disabled={record.status !== 'pending'}>修改</Button>
                    <Button type="link" size="small" icon={<CheckSquareOutlined />} onClick={() => handleOpenAudit(record)} disabled={record.status !== 'pending'}>审核</Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '0' }}>
            {/* 搜索栏 */}
            <Card style={{ marginBottom: 16 }}>
                <Form form={searchForm} onFinish={() => handleSearch(true)}>
                    <Row gutter={16} align="middle">
                        <Col><Form.Item name="orderId" style={{margin:0}}><Input placeholder="订单编号" style={{width:150}}/></Form.Item></Col>
                        <Col><Form.Item name="operator" style={{margin:0}}><Input placeholder="开单员" style={{width:120}}/></Form.Item></Col>
                        <Col><Form.Item name="dateRange" style={{margin:0}}><RangePicker style={{width:240}}/></Form.Item></Col>
                        <Col><Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button></Col>
                        <Col><Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button></Col>
                    </Row>
                </Form>
            </Card>

            {/* 订单列表 */}
            <Card title="订单列表" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>创建订单</Button>}>
                <Table rowKey="key" columns={columns} dataSource={data} loading={loading} pagination={{ pageSize: 10 }} />
            </Card>

            {/* A: 新增/修改 (Form) */}
            <Modal
                title={modalTitle}
                open={isEditModalOpen}
                onOk={handleEditSubmit}
                onCancel={() => setIsEditModalOpen(false)}
                confirmLoading={modalLoading}
                width={1000}
                destroyOnClose
            >
                <Form form={orderForm} layout="vertical" preserve={false}>
                    <Card size="small" title="基础信息" style={{ marginBottom: 16 }}>
                        <Row gutter={16}>
                            <Col span={6}><Form.Item name="customer" label="客户名称" rules={[{ required: true }]}><Input /></Form.Item></Col>
                            <Col span={6}><Form.Item name="phone" label="联系电话" rules={[{ required: true }]}><Input /></Form.Item></Col>
                            <Col span={6}><Form.Item name="createTime" label="接单日期" rules={[{ required: true }]}><DatePicker style={{width:'100%'}} /></Form.Item></Col>
                            <Col span={6}><Form.Item name="deliveryTime" label="交货日期"><DatePicker style={{width:'100%'}} /></Form.Item></Col>
                            <Col span={12}><Form.Item name="address" label="收货地址"><Input /></Form.Item></Col>
                            <Col span={6}><Form.Item name="operator" label="负责人"><Input /></Form.Item></Col>
                            <Col span={6}><Form.Item name="deliveryMethod" label="提货方式"><Select><Option value="送货上门">送货上门</Option><Option value="自提">自提</Option></Select></Form.Item></Col>
                            <Col span={24}><Form.Item name="note" label="客户备注"><TextArea rows={2} /></Form.Item></Col>
                        </Row>
                    </Card>

                    <Card size="small" title="产品订货明细" style={{ marginBottom: 16 }}>
                        <Form.List name="products">
                            {(fields, { add, remove }) => (
                                <>
                                    {/* 模拟表头 */}
                                    <div style={{ display: 'flex', background: '#fafafa', borderBottom: '1px solid #eee', padding: '8px 0', minWidth: '900px', fontWeight: 'bold', textAlign: 'center', fontSize: '12px' }}>
                                        <div style={{ flex: 2 }}>包框尺寸(宽*高*墙)</div>
                                        <div style={{ flex: 1.5 }}>款式</div>
                                        <div style={{ flex: 1 }}>颜色</div>
                                        <div style={{ flex: 1 }}>开向</div>
                                        <div style={{ flex: 1 }}>锁向</div>
                                        <div style={{ flex: 1 }}>吊脚</div>
                                        <div style={{ flex: 1 }}>数量</div>
                                        <div style={{ flex: 1 }}>单位</div>
                                        <div style={{ flex: 1.5 }}>单价</div>
                                        <div style={{ flex: 1.5 }}>备注</div>
                                        <div style={{ width: 40 }}>删</div>
                                    </div>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: 4, marginTop: 4, minWidth: '900px' }}>
                                            <Form.Item {...restField} name={[name, 'size']} style={{ flex: 2, margin: '0 4px 0 0' }}><Input size="small"/></Form.Item>
                                            <Form.Item {...restField} name={[name, 'style']} style={{ flex: 1.5, margin: '0 4px 0 0' }}><Input size="small"/></Form.Item>
                                            <Form.Item {...restField} name={[name, 'color']} style={{ flex: 1, margin: '0 4px 0 0' }}><Input size="small"/></Form.Item>
                                            <Form.Item {...restField} name={[name, 'open']} style={{ flex: 1, margin: '0 4px 0 0' }}><Input size="small"/></Form.Item>
                                            <Form.Item {...restField} name={[name, 'lock']} style={{ flex: 1, margin: '0 4px 0 0' }}><Input size="small"/></Form.Item>
                                            <Form.Item {...restField} name={[name, 'foot']} style={{ flex: 1, margin: '0 4px 0 0' }}><Input size="small"/></Form.Item>
                                            <Form.Item {...restField} name={[name, 'qty']} style={{ flex: 1, margin: '0 4px 0 0' }}><InputNumber size="small" min={1} style={{width:'100%'}}/></Form.Item>
                                            <Form.Item {...restField} name={[name, 'unit']} style={{ flex: 1, margin: '0 4px 0 0' }}><Input size="small"/></Form.Item>
                                            <Form.Item {...restField} name={[name, 'price']} style={{ flex: 1.5, margin: '0 4px 0 0' }}><InputNumber size="small" min={0} style={{width:'100%'}}/></Form.Item>
                                            <Form.Item {...restField} name={[name, 'remark']} style={{ flex: 1.5, margin: '0 4px 0 0' }}><Input size="small"/></Form.Item>
                                            <div style={{ width: 40, textAlign: 'center' }}><MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} /></div>
                                        </div>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusCircleOutlined />} size="small" style={{marginTop:8}}>添加产品</Button>
                                </>
                            )}
                        </Form.List>
                    </Card>

                    <Card size="small" title="费用结算">
                        <Row gutter={16}>
                            <Col span={6}><Form.Item name="deposit" label="已付定金"><InputNumber prefix="¥" style={{width:'100%'}} /></Form.Item></Col>
                            <Col span={6}><Form.Item name="status" label="状态"><Select><Option value="pending">待审核</Option><Option value="paid">已支付</Option></Select></Form.Item></Col>
                        </Row>
                    </Card>
                </Form>
            </Modal>

            {/* B: 详情 (严格对齐版) */}
            <Modal
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                width={950}
                footer={[<Button key="print" icon={<PrinterOutlined />} onClick={handlePrintOrder}>打印</Button>,<Button key="close" onClick={() => setIsDetailModalOpen(false)}>关闭</Button>]}
                styles={{ body: { padding: 0 } }}
                centered
            >
                {currentRecord && (
                    <div id="print-area" style={printStyles.container}>
                        <div style={printStyles.header}>
                            <h1 style={printStyles.title}>信宜市耀祥门业有限公司订货单</h1>
                            <p style={printStyles.subTitle}>订货电话（微信同号）：17724137300</p>
                        </div>

                        <table style={printStyles.table}>
                            {/*
                       关键修复：定义 12 列网格 (Grid System)
                       每一列代表产品表的一个字段，确保上下对齐
                    */}
                            <colgroup>
                                <col style={{width: '4%'}} />  {/* 序号 */}
                                <col style={{width: '12%'}} /> {/* 尺寸 */}
                                <col style={{width: '10%'}} /> {/* 款式 */}
                                <col style={{width: '8%'}} />  {/* 颜色 */}
                                <col style={{width: '6%'}} />  {/* 开向 */}
                                <col style={{width: '6%'}} />  {/* 锁向 */}
                                <col style={{width: '6%'}} />  {/* 吊脚 */}
                                <col style={{width: '6%'}} />  {/* 数量 */}
                                <col style={{width: '6%'}} />  {/* 单位 */}
                                <col style={{width: '10%'}} /> {/* 单价 */}
                                <col style={{width: '10%'}} /> {/* 金额 */}
                                <col style={{width: '16%'}} /> {/* 备注 */}
                            </colgroup>
                            <tbody>
                            {/* 1. 表头 (按 12 列分配 colSpan) */}
                            {/* Row 1: Label(1) + Val(3) + Label(1) + Val(3) + Label(1) + Val(3) = 12 */}
                            <tr>
                                <td style={{...printStyles.td, ...printStyles.labelTd}}>客户名称:</td>
                                <td style={printStyles.td} colSpan={3}>{currentRecord.customer}</td>
                                <td style={{...printStyles.td, ...printStyles.labelTd}}>电话:</td>
                                <td style={printStyles.td} colSpan={3}>{currentRecord.phone}</td>
                                <td style={{...printStyles.td, ...printStyles.labelTd}}>接单日期:</td>
                                <td style={printStyles.td} colSpan={3}>{currentRecord.createTime}</td>
                            </tr>

                            {/* Row 2: 备注跨行 */}
                            <tr>
                                <td style={{...printStyles.td, ...printStyles.labelTd}} rowSpan={2}>客户备注:</td>
                                {/* 3 cols for value */}
                                <td style={printStyles.td} colSpan={3} rowSpan={2}>{currentRecord.note}</td>

                                <td style={{...printStyles.td, ...printStyles.labelTd}}>地址:</td>
                                <td style={printStyles.td} colSpan={3}>{currentRecord.address}</td>
                                <td style={{...printStyles.td, ...printStyles.labelTd}}>交货日期:</td>
                                <td style={printStyles.td} colSpan={3}>{currentRecord.deliveryTime}</td>
                            </tr>

                            {/* Row 3 */}
                            <tr>
                                <td style={{...printStyles.td, ...printStyles.labelTd}}>负责人:</td>
                                <td style={printStyles.td} colSpan={3}>{currentRecord.operator}</td>
                                <td style={{...printStyles.td, ...printStyles.labelTd}}>提货方式:</td>
                                <td style={printStyles.td} colSpan={3}>{currentRecord.deliveryMethod}</td>
                            </tr>

                            {/* 2. 产品表头 (12 列) */}
                            <tr>
                                <td style={printStyles.td}>序号</td>
                                <td style={printStyles.td}>包框尺寸<br/><span style={{fontSize:10}}>(宽*高*墙厚)</span></td>
                                <td style={printStyles.td}>款式</td>
                                <td style={printStyles.td}>颜色</td>
                                <td style={printStyles.td}>开向</td>
                                <td style={printStyles.td}>锁向</td>
                                <td style={printStyles.td}>吊脚</td>
                                <td style={printStyles.td}>数量</td>
                                <td style={printStyles.td}>单位</td>
                                <td style={printStyles.td}>单价</td>
                                <td style={printStyles.td}>金额</td>
                                <td style={printStyles.td}>备注</td>
                            </tr>

                            {/* 3. 产品数据 */}
                            {currentRecord.products.map((prod, index) => (
                                <tr key={index}>
                                    <td style={printStyles.td}>{index + 1}</td>
                                    <td style={printStyles.td}>{prod.size}</td>
                                    <td style={printStyles.td}>{prod.style}</td>
                                    <td style={printStyles.td}>{prod.color}</td>
                                    <td style={printStyles.td}>{prod.open}</td>
                                    <td style={printStyles.td}>{prod.lock}</td>
                                    <td style={printStyles.td}>{prod.foot}</td>
                                    <td style={printStyles.td}>{prod.qty}</td>
                                    <td style={printStyles.td}>{prod.unit}</td>
                                    <td style={printStyles.td}>{prod.price}</td>
                                    <td style={printStyles.td}>{Number(prod.price) * Number(prod.qty)}</td>
                                    <td style={printStyles.td}>{prod.remark}</td>
                                </tr>
                            ))}

                            {/* 空行补位 */}
                            {[1,2,3].map(k => (
                                <tr key={`empty-${k}`}>
                                    <td style={printStyles.td}>&nbsp;</td>
                                    {Array(11).fill(0).map((_,i)=><td key={i} style={printStyles.td}></td>)}
                                </tr>
                            ))}

                            {/* 4. 底部 (按 12 列分配) */}
                            {/* 客户须知 (10 cols: 1 Label + 9 Content) + 金额 (2 cols: 1 Label + 1 Value) */}
                            <tr>
                                <td style={{...printStyles.td, ...printStyles.labelTd}} rowSpan={3}>客户须知</td>
                                {/* colSpan 9: 占据中间大部分区域 */}
                                <td style={{...printStyles.td, ...printStyles.noticeBox}} colSpan={9} rowSpan={3}>
                                    <div style={printStyles.noticeTitle}>尊敬的客户：感谢您选择耀祥！</div>
                                    1. 请您仔细核对以上订单内容，该订单一经确认即以此单作为生产单作为收货依据，生产后无法修改，敬请谅解。<br/>
                                    2. 订单通知完成15天内必须提货，逾期不提将收取每天每套5元仓库保管费。
                                </td>
                                {/* 右侧金额 */}
                                <td style={{...printStyles.td, ...printStyles.labelTd}}>总金额:</td>
                                <td style={printStyles.td}>{currentRecord.amount}</td>
                            </tr>
                            <tr>
                                <td style={{...printStyles.td, ...printStyles.labelTd}}>定 金:</td>
                                <td style={printStyles.td}>{currentRecord.deposit}</td>
                            </tr>
                            <tr>
                                <td style={{...printStyles.td, ...printStyles.labelTd}}>余 款:</td>
                                <td style={printStyles.td}>{currentRecord.amount - currentRecord.deposit}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </Modal>

            {/* C: 审核 */}
            <Modal title="审核订单" open={isAuditModalOpen} onCancel={() => setIsAuditModalOpen(false)} footer={null} width={400}>
                <p style={{margin: '20px 0'}}>当前订单号：<b>{currentRecord?.orderId}</b><br/>请确认该订单信息是否无误？</p>
                <div style={{display:'flex', justifyContent:'flex-end', gap:10}}>
                    <Button onClick={() => setIsAuditModalOpen(false)}>取消</Button>
                    <Button danger loading={modalLoading} onClick={() => handleAuditSubmit(false)}>驳回</Button>
                    <Button type="primary" loading={modalLoading} onClick={() => handleAuditSubmit(true)}>通过</Button>
                </div>
            </Modal>
        </div>
    );
};

export default OrderManagement;