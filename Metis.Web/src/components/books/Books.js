import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Tag, PageHeader, Typography, Divider } from 'antd';
import { NavLink } from 'react-router-dom';
import { callFetch } from '../../services/HttpService';
import { calculateStatus } from '../../services/CommonFunctions';
const { Paragraph } = Typography;
const formItemLayout = {
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 20 },
    xxl: { span: 18 },
};
const routes = [
    { path: 'dashboard', breadcrumbName: 'Αρχική' },
    { path: '', breadcrumbName: 'Συμβάντα' }
];
const Books = () => {
    const [data, setData] = useState([]);
    const columns = [{
        title: 'Τίτλος',
        dataIndex: 'name',
        key: 'name',
        render: (e, row) => <NavLink to={'/book/monitor/' + row.id}>{row.name}</NavLink>
    }, {
        title: 'Δημιουργήθηκε',
        dataIndex: 'close',
        key: 'close'
    }, {
        title: 'Συντάκτης',
        dataIndex: 'owner.name',
        key: 'owner'
    }, {
        title: 'Γεγονότα',
        dataIndex: 'entriesCount',
        key: 'entriesCount'
    }, {
        title: 'Μέλη',
        dataIndex: 'membersCount',
        key: 'membersCount'
    }, {
        title: 'Κατάσταση',
        dataIndex: 'status',
        key: 'status',
        render: (e, row) => calculateStatus(row.close)
    }, {
        title: 'Ενέργειες',
        key: 'action',
        render: (e, row) => (
            <span>
                <NavLink to={'/book/' + row.id}>επεξεργασία</NavLink>
                <Divider type="vertical" />
                <NavLink to={'/book/monitor/' + row.id}>προβολή</NavLink>
            </span>

        )
    }];

    useEffect(() => {
        callFetch('logbooks', 'GET').then(res => {
            setData(res);
            console.log(res);
        });
    }, [])

    return (
        <Row type="flex" justify="center">
            <Col span={24}>
                <PageHeader title="Συμβάντα" breadcrumb={{ routes }}>
                    <Paragraph>
                        Σύντομη ανασκόπηση συμβάντων ταξινομημένα κατα ημερομηνία
                </Paragraph>
                </PageHeader></Col>
            <Col {...formItemLayout} className="mt-2">
                <Table rowKey="id" columns={columns} dataSource={data} />
            </Col>
        </Row>);
};

export default Books;