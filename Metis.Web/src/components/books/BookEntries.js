import React from 'react';
import { Table, Divider } from 'antd';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

const BookEntries = props => {
    const columns = [{
        title: 'Προτεραιότητα',
        dataIndex: 'priority',
        key: 'priority'
    }, {
        title: 'DTG',
        dataIndex: 'dTG',
        key: 'dTG',
        render: item => moment(item).format('L')
    }, {
        title: 'Εκδότης',
        dataIndex: 'issuer',
        key: 'issuer',
        render: item => item.name
    }, {
        title: 'Παραλήπτης',
        dataIndex: 'recipient',
        key: 'recipient',
        render: item => item.name
    }, {
        title: 'Τίτλος',
        dataIndex: 'title',
        key: 'title'
    }, {
        title: 'Περιγραφή',
        dataIndex: 'description',
        key: 'description'
    }, {
        title: 'Κατάσταση',
        dataIndex: 'status',
        key: 'status',
        render: item => item
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


    return (
        <Table rowKey="id" columns={columns} dataSource={props.data} />
    );
};

export default BookEntries;