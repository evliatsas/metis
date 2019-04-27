import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Tag, PageHeader, Typography } from 'antd';
import { callFetch } from '../../services/HttpService';
const { Paragraph } = Typography;
const formItemLayout = {
    sm: { span: 24 },
    md: { span: 22 },
    lg: { span: 20 },
    xxl: { span: 16 },
};
const routes = [
    { path: 'dashboard', breadcrumbName: 'Αρχική' },
    { path: '', breadcrumbName: 'Συμβάντα' }
];

const calculateStatus = (date) => {
    const _d = new Date(date);
    const d = new Date();
    return _d.getTime() > d.getTime() ? <Tag color="green">Ενεργό</Tag> :
        <Tag color="red">Ανενεργό</Tag>;
}
const Books = () => {
    const [data, setData] = useState([]);
    const columns = [{
        title: 'Τίτλος',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href="#">{text}</a>,
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
        render: () => (        
            <a href="javascript:;">επεξεργασία</a>
        )
      }];

    useEffect(() => {
        callFetch('logbooks', 'GET').then(res => {
            setData(res);
        });
    }, [])

    return (
        <Row type="flex" justify="center">
            <Col {...formItemLayout}>
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