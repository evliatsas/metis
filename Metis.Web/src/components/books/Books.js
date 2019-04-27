import React, { useState, useEffect } from 'react';
import { Table, Divider, Row, Col, Tag } from 'antd';
import { callFetch } from '../../services/HttpService';
const formItemLayout = {
    sm: { span: 24 },
    lg: { span: 18 },
    xxl: { span: 16 },
};
const Books = () => {
    const [data, setData] = useState([]);
    const columns = [{
        title: 'Τίτλος',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    }, {
        title: 'Δημιουργήθηκε',
        dataIndex: 'close',
        key: 'close',
    }];

    useEffect(() => {
        callFetch('logbooks', 'GET').then(res => {
            setData(res);
        });
    }, [])
    return (
        <Row type="flex" justify="center">
            <Col {...formItemLayout} >
                <Table rowKey="id" columns={columns} dataSource={data} />
            </Col>
        </Row>);
};

export default Books;