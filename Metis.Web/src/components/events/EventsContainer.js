import React from 'react';
import { Row, Col } from 'antd';
import Events from './Events';
import EventChat from './EventChat';
const EventsContainer = () => {

    return (
        <Row>
            <Col span={16}><Events /></Col>
            <Col span={8}><EventChat /></Col>
        </Row>
    );
};

export default EventsContainer;