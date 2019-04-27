import React from 'react';
import { Row, Col } from 'antd';
import Books from './Books';
import BookChat from './BookChat';
const BooksContainer = () => {

    return (
        <Row>
            <Col span={16}><Books /></Col>
            <Col span={8}><BookChat /></Col>
        </Row>
    );
};

export default BooksContainer;