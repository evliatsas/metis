import React, { } from 'react';
import { Statistic, Row, Col, Icon, Card } from 'antd';


const Dashboard = () => {
  const counters = [
    { value: 254, label: 'Guarded Sites', icon: 'safety-certificate', color: 'green' },
    { value: 2, label: 'Alarm Sites', icon: 'warning', color: 'red' },
    { value: 4, label: 'Paused Sites', icon: 'bell', color: 'yellow' },
    { value: 44, label: 'Unattended Sites', icon: 'question-circle', color: '' }
  ];
  const counterCards = counters.map((c, i) => <Col sm={12} xs={24} md={12} lg={6} xl={6} xxl={6} key={i} className="p-3">
    <Card className="has-background-dark">
      <Statistic  title={c.label} value={c.value}
        prefix={<Icon type={c.icon} theme="twoTone" twoToneColor={c.color} />} />
    </Card>
  </Col>
  )
  return <Row >
    {counterCards}
  </Row>;
};

export default Dashboard;