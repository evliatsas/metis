import React from 'react';
import { Table, Divider, Tag, Tooltip , Popconfirm, message} from 'antd';
import moment from 'moment';
import { priority } from '../../services/CommonFunctions'

const BookEntries = props => {
    const columns = [{
        title: <Tooltip title="Προτεραιότητα">Π</Tooltip>,
        dataIndex: 'priority',
        key: 'priority',
        render: p => priority[p]
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
        render: s => s == 1 ? <Tag color="magenta">Close</Tag> : <Tag color="#40861d">Open</Tag>
    }, {
        title: 'Ενέργειες',
        key: 'action',
        render: (e, row) => (
            <span>
                <span className="is-link" onClick={() => props.edit(row)}>επεξεργασία</span>
                <Divider type="vertical" />
                <Popconfirm title="Θέλετε σίγουρα να αφαιρέσετε το γεγονός?"
                 onConfirm={confirmDelete} onCancel={null} okText="Ναι" cancelText="Όχι">
                    <span className="is-danger">διαγραφή</span>
                </Popconfirm>
              
            </span>

        )
    }];

    const confirmDelete = () => {
        message.info('Συντομα κοντά σας')
    }
    return (
        <Table rowKey="id" columns={columns} dataSource={props.data} />
    );
};

export default BookEntries;