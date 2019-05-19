import React from 'react'
import { Table, Divider, Tag, Tooltip, Popconfirm, message } from 'antd'
import moment from 'moment'
import { getCurrentMember } from '../../services/CommonFunctions'
import { priority } from '../../services/CommonFunctions'
const currentUser = getCurrentMember()
const BookEntries = props => {
  const canDeleteOrEdit = (row) => {
    return row.issuer.userId === currentUser.userId ||
      row.recipient.userId === currentUser.userId
  }
  const columns = [
    {
      title: <Tooltip title="Προτεραιότητα">Π</Tooltip>,
      dataIndex: 'priority',
      key: 'priority',
      render: p => priority[p]
    },
    {
      title: 'DTG',
      dataIndex: 'dtg',
      key: 'dtg',
      render: item => moment(item).format('L')
    },
    {
      title: 'Εκδότης',
      dataIndex: 'issuer',
      key: 'issuer',
      render: item => item.name
    },
    {
      title: 'Παραλήπτης',
      dataIndex: 'recipient',
      key: 'recipient',
      render: item => item.name
    },
    {
      title: 'Τίτλος',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Περιγραφή',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Κατάσταση',
      dataIndex: 'status',
      key: 'status',
      render: s =>
        s === 1 ? (
          <Tag color="magenta">Close</Tag>
        ) : (
            <Tag color="#40861d">Open</Tag>
          )
    },
    {
      title: 'Ενέργειες',
      key: 'action',
      render: (e, row) => (
        <span>
          <span className="is-link" onClick={() => props.edit(row)}>
            {canDeleteOrEdit(row) ? 'επεξεργασία' : 'προβολή'}
          </span>
          {canDeleteOrEdit(row) ?
            <span><Divider type="vertical" />
              <Popconfirm
                title="Θέλετε σίγουρα να αφαιρέσετε το γεγονός?"
                onConfirm={() => props.onDelete(row)}
                onCancel={null}
                okText="Ναι"
                cancelText="Όχι">
                <span className="is-danger">διαγραφή</span>
              </Popconfirm></span> : null}
        </span>
      )
    }
  ]

  return <Table style={{ padding: 10 }} rowKey="id" columns={columns} dataSource={props.data} />
}

export default BookEntries
