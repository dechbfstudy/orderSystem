import React from 'react';
import { Card, Col, Row, Statistic, theme, Table, Tag, Avatar } from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    PayCircleOutlined,
    TeamOutlined
} from '@ant-design/icons';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { useAppTheme } from '../context/ThemeContext'; // 获取全局主题色

// =======================
// 1. 模拟数据
// =======================

// 曲线图数据：近7天销售额与订单量
const SALES_DATA = [
    { date: '周一', sales: 4000, orders: 24 },
    { date: '周二', sales: 3000, orders: 13 },
    { date: '周三', sales: 2000, orders: 98 },
    { date: '周四', sales: 2780, orders: 39 },
    { date: '周五', sales: 1890, orders: 48 },
    { date: '周六', sales: 2390, orders: 38 },
    { date: '周日', sales: 3490, orders: 43 },
];

// 饼状图数据：订单状态分布 (对应 OrderManagement)
const ORDER_STATUS_DATA = [
    { name: '待审核 (Pending)', value: 12 },
    { name: '已支付 (Paid)', value: 35 },
    { name: '已发货 (Shipped)', value: 10 },
    { name: '已完成 (Completed)', value: 80 },
    { name: '已取消 (Cancelled)', value: 5 },
];

// 柱状图数据：用户增长 vs 客户增长
const GROWTH_DATA = [
    { month: '1月', newUsers: 40, newCustomers: 24 },
    { month: '2月', newUsers: 30, newCustomers: 13 },
    { month: '3月', newUsers: 20, newCustomers: 98 },
    { month: '4月', newUsers: 27, newCustomers: 39 },
    { month: '5月', newUsers: 18, newCustomers: 48 },
    { month: '6月', newUsers: 23, newCustomers: 38 },
];

// 饼图颜色 (对应 Ant Design 常用色)
const PIE_COLORS = ['#FAAD14', '#1677FF', '#13C2C2', '#52C41A', '#FF4D4F'];

// 最新交易列表
const RECENT_ORDERS = [
    { key: 1, id: 'ORD-2023-001', user: '客户王总', amount: 1200.50, status: 'paid' },
    { key: 2, id: 'ORD-2023-002', user: '李经理', amount: 88.00, status: 'pending' },
    { key: 3, id: 'ORD-2023-003', user: '张三科技', amount: 5600.00, status: 'completed' },
    { key: 4, id: 'ORD-2023-004', user: '赵六', amount: 332.00, status: 'shipped' },
];

const Home = () => {
    const { token } = theme.useToken();
    // 获取全局主题色，让图表颜色随主题变化
    const { primaryColor, isDarkMode } = useAppTheme();

    // 动态图表样式配置
    const chartTextColor = isDarkMode ? '#rgba(255,255,255,0.65)' : '#666';
    const chartGridColor = isDarkMode ? '#303030' : '#f0f0f0';

    // 渲染统计卡片的辅助组件
    const StatCard = ({ title, value, prefix, suffix, color, icon }) => (
        <Card bordered={false} hoverable style={{ height: '100%' }}>
            <Statistic
                title={<span style={{ color: '#999', fontSize: 14 }}>{title}</span>}
                value={value}
                precision={2}
                valueStyle={{ color: isDarkMode ? '#fff' : '#000', fontWeight: 'bold' }}
                prefix={prefix}
                suffix={
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, marginLeft: 8 }}>
                        {suffix}
                    </div>
                }
            />
            <div style={{
                position: 'absolute', right: 24, top: 24,
                padding: 8, borderRadius: '50%', background: `${color}20`, color: color
            }}>
                {icon}
            </div>
        </Card>
    );

    return (
        <div>
            {/* 1. 顶部统计卡片区域 */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard
                        title="总销售额"
                        value={126560}
                        prefix="¥"
                        color="#1677ff"
                        icon={<PayCircleOutlined style={{ fontSize: 24 }} />}
                        suffix={<span style={{ color: '#cf1322' }}><ArrowUpOutlined /> 12%</span>}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard
                        title="总订单量"
                        value={8846}
                        prefix=""
                        color="#52c41a"
                        icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />}
                        suffix={<span style={{ color: '#3f8600' }}><ArrowUpOutlined /> 5%</span>}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard
                        title="合作客户"
                        value={87}
                        prefix=""
                        color="#fa8c16"
                        icon={<TeamOutlined style={{ fontSize: 24 }} />}
                        suffix={<span style={{ color: '#3f8600' }}><ArrowUpOutlined /> 8%</span>}
                    />
                </Col>
            </Row>

            {/* 2. 中间图表区域：销售趋势 + 订单状态 */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={16}>
                    <Card title="销售趋势 (近7天)" bordered={false} style={{ height: '100%' }}>
                        <div style={{ width: '100%', height: 320 }}>
                            <ResponsiveContainer>
                                <AreaChart data={SALES_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke={chartTextColor} />
                                    <YAxis stroke={chartTextColor} />
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', border: 'none' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke={primaryColor}
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                        name="销售额"
                                    />
                                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="订单数" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="订单状态分布" bordered={false} style={{ height: '100%' }}>
                        <div style={{ width: '100%', height: 320 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={ORDER_STATUS_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {ORDER_STATUS_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* 3. 底部图表区域：用户增长 + 最新交易 */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={12}>
                    <Card title="客户增长对比" bordered={false} style={{ height: '100%' }}>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={GROWTH_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                                    <XAxis dataKey="month" stroke={chartTextColor} />
                                    <YAxis stroke={chartTextColor} />
                                    <Tooltip cursor={{ fill: isDarkMode ? '#ffffff10' : '#f0f0f0' }} />
                                    <Legend />
                                    <Bar dataKey="newCustomers" name="新增合作客户" fill="#ffc658" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="最新交易记录" bordered={false} style={{ height: '100%' }}>
                        <Table
                            dataSource={RECENT_ORDERS}
                            pagination={false}
                            size="middle"
                            columns={[
                                { title: '订单号', dataIndex: 'id' },
                                { title: '客户', dataIndex: 'user', render: t => <><Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00', marginRight: 8 }}>{t[0]}</Avatar>{t}</> },
                                { title: '金额', dataIndex: 'amount', render: v => `¥${v.toLocaleString()}` },
                                {
                                    title: '状态',
                                    dataIndex: 'status',
                                    render: s => {
                                        let color = 'default';
                                        if (s === 'paid') color = 'blue';
                                        if (s === 'completed') color = 'green';
                                        if (s === 'shipped') color = 'cyan';
                                        if (s === 'pending') color = 'gold';
                                        return <Tag color={color}>{s.toUpperCase()}</Tag>
                                    }
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Home;