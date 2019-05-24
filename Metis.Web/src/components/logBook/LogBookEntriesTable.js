import React from 'react'
import {
  Table as AntdTable,
  Tooltip as AntdTooltip,
  Tag as AntdTag,
  Button as AntdButton,
  Popconfirm as AntdPopconfirm,
  Comment
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
  0: { color: '#631ff4', caption: 'Κανονική' },
  1: { color: '#065d9b', caption: 'Δευτερεύων' },
  2: { color: '#e0610d', caption: 'Επείγον' },
  3: { color: '#e00d0d', caption: 'Άμεσο' }
}

function isEntryIssuerOrRecipient(entry) {
  const user = storage.get('auth')
  return (
    entry.issuer.userId === user.userid ||
    entry.recipient.userId === user.userid
  )
}

const columns = [
  {
    title: 'Έναρξη - Λήξη',
    dataIndex: 'dtg',
    key: 'dtg',
    render: (item, row) =>
      moment(item).format(STRINGS.DATETIME_FORMAT) +
      ' - ' +
      moment(row.ect).format(STRINGS.DATETIME_FORMAT)
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
    {
      <AntdTag color={PRIORITIES[entry.priority].color}>
        {PRIORITIES[entry.priority].caption}
      </AntdTag>
    }
  </div>
)

const LogBookEntriessTable = ({ entries, onEdit, onDelete }) => {
  const headers = [
    ...columns,
    {
      title: 'Ενέργειες',
      key: 'action',
      render: (e, row) => {
        if (!isEntryIssuerOrRecipient(row)) {
          return null
        }
        return (
          <div className="metis-table-actions">
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
                  className="metis-table-delete-button"
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
      expandedRowRender={row => (
        <div>
          <Comment
            author={<span style={{ color: 'white' }}>Περιγραφή</span>}
            content={<p>{row.description} </p>}
          />
          <Comment
            author={<span style={{ color: 'white' }}>Ενέργειες</span>}
            content={<p>{row.actions}</p>}
          />
        </div>
      )}
      pagination={{ defaultPageSize: 10, hideOnSinglePage: true }}
    />
  )
}

export default LogBookEntriessTable
