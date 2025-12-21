import React from 'react';
import { Card, Col, Row, Statistic, Button } from 'antd';

const Home = () => (
    <div>
        <Row gutter={16}>
            <Col span={8}>
                <Card>
                    <Statistic title="Active Users" value={112893} />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic title="Account Balance" value={112893} precision={2} />
                    <Button style={{ marginTop: 16 }} type="primary">Recharge</Button>
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic title="Active Orders" value={93} valueStyle={{ color: '#cf1322' }} />
                </Card>
            </Col>
        </Row>
    </div>
);
export default Home;