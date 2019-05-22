import React from 'react'
import {
  Table as AntdTable,
  Tooltip as AntdTooltip,
  Tag as AntdTag,
  Button as AntdButton,
  Popconfirm as AntdPopconfirm
} from 'antd'
import moment from 'moment'
import storage from '../../services/storage'
import './logBook.less'

const STRINGS = {
  DATETIME_FORMAT: 'DD/MM HH:mm',
  EDIT: 'επεξεργασία',
  DELETE: 'διαγραφή',
  DELETE_CONFIRMATION:
    'Θέλετε σίγουρα να αφαιρέσετε το συμβάν; (η διαδικασία είναι μη αναιρέσιμη)',
  OPEN: 'Ενεργό',
  CLOSED: 'Ανενεργό'
}

const PRIORITIES = {
  //0: { color: 'primary', caption: '' },
  1: { color: '#065d9b', caption: 'Δευτερεύων' },
  2: { color: '#e0610d', caption: 'Επείγον' },
  3: { color: '#e00d0d', caption: 'Άμενο' }
}

function isEntryIssuer(entry) {
  const user = storage.get('auth')
  return entry.issuer.userId === user.userid
}

const columns = [
  {
    title: 'Έναρξη',
    dataIndex: 'dtg',
    key: 'dtg',
    render: item => moment(item).format(STRINGS.DATETIME_FORMAT)
  },
  {
    title: 'Λήξη',
    dataIndex: 'ect',
    key: 'ect',
    render: item => moment(item).format(STRINGS.DATETIME_FORMAT)
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
    key: 'tags',
    render: entry => <LogBookEntryTags entry={entry} />
  }
]

const LogBookEntryTags = ({ entry }) => (
  <div>
    {entry.status === 1 ? (
      <AntdTag color="#cf1322">{STRINGS.CLOSED}</AntdTag>
    ) : (
      <AntdTag color="#378212">{STRINGS.OPEN}</AntdTag>
    )}
    {entry.priority > 0 && (
      <AntdTag color={PRIORITIES[entry.priority].color}>
        {PRIORITIES[entry.priority].caption}
      </AntdTag>
    )}
  </div>
)

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
              <AntdButton
                size="small"
                type="ghost"
                shape="circle"
                icon="form"
                onClick={() => onEdit(row)}
              />
            </AntdTooltip>
            <AntdPopconfirm
              title={STRINGS.DELETE_CONFIRMATION}
              onConfirm={() => onDelete(row)}
              onCancel={null}
              okText="Ναι"
              cancelText="Όχι">
              <AntdTooltip title={STRINGS.DELETE}>
                <AntdButton
                  className="logbook-delete-entry-button"
                  size="small"
                  type="ghost"
                  shape="circle"
                  icon="delete"
                />
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
      pagination={{ defaultPageSize: 10, hideOnSinglePage: true }}
    />
  )
}

export default LogBookEntriessTable
