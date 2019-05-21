import React from 'react'
import {
  Table as AntdTable,
  Tooltip as AntdTooltip,
  Tag as AntdTag,
  Icon as AntdIcon,
  Popconfirm as AntdPopconfirm
} from 'antd'
import moment from 'moment'
import storage from '../../services/storage'
import './logBook.less'

const STRINGS = {
  PRIORITIES: ['Normal', 'Low', 'High', 'Urgent'],
  EDIT: 'επεξεργασία',
  DELETE: 'διαγραφή',
  OPEN: 'Ενεργό',
  CLOSED: 'Ανενεργό'
}

function isEntryIssuer(entry) {
  const user = storage.get('auth')
  return entry.issuer.userId === user.userid
}

const columns = [
  {
    title: <AntdTooltip title="Προτεραιότητα">Π</AntdTooltip>,
    dataIndex: 'priority',
    key: 'priority',
    render: p => STRINGS.PRIORITIES[p]
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
        <AntdTag color="#cf1322">{STRINGS.CLOSED}</AntdTag>
      ) : (
        <AntdTag color="#378212">{STRINGS.OPEN}</AntdTag>
      )
  }
]

const LogBookEntriessTable = ({ entries, onEdit, onDelete }) => {
  const headers = [
    ...columns,
    {
      title: 'Ενέργειες',
      key: 'action',
      render: (e, row) => {
        if (!isEntryIssuer(row)) {
          return null
        }
        return (
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <AntdTooltip title={STRINGS.EDIT}>
              <AntdIcon
                className="is-link"
                type="form"
                onClick={() => onEdit(row)}
              />
            </AntdTooltip>
            <AntdPopconfirm
              title="Θέλετε σίγουρα να αφαιρέσετε το γεγονός?"
              onConfirm={() => onDelete(row)}
              onCancel={null}
              okText="Ναι"
              cancelText="Όχι">
              <AntdTooltip title={STRINGS.DELETE}>
                <AntdIcon style={{ color: 'red' }} type="delete" />
              </AntdTooltip>
            </AntdPopconfirm>
          </div>
        )
      }
    }
  ]
  return (
    <AntdTable
      rowKey={item => item.id}
      columns={headers}
      dataSource={entries}
    />
  )
}

export default LogBookEntriessTable
