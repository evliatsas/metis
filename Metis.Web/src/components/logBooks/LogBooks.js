import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Button as AntdButton,
  Tooltip as AntdTooltip,
  Popconfirm as AntdPopconfirm
} from 'antd'
import moment from 'moment'
import LogBooksContainer from '../containers/LogBooksContainer'
import PageHeader from '../shared/PageHeader'
import Table from '../shared/Table'
import LogBookStatus from './LogBookStatus'

const STRINGS = {
  TITLE: 'Βιβλία Καταγραφής',
  SUBTITLE: 'λίστα βιβλίων καταγραφής συμβάντων',
  REFRESH: 'Ανανέωση',
  NEW: 'Νέο Βιβλίο',
  EDIT: 'Επεξεργασία',
  VIEW: 'Προβολή',
  DELETE: 'Διαγραφή',
  DELETE_CONFIRMATION:
    'Είστε σίγουρος ότι επιθυμείτε να διαγράψετε το επιλεγμένο Βιβλίο;'
}

const columns = [
  {
    title: 'Τίτλος',
    dataIndex: 'name',
    key: 'name',
    render: (e, row) => <NavLink to={`/logbooks/${row.id}`}>{row.name}</NavLink>
  },
  {
    title: 'Λήξη',
    dataIndex: 'close',
    key: 'close',
    render: item => moment(item).format('L')
  },
  {
    title: 'Συντάκτης',
    dataIndex: 'owner.name',
    key: 'owner'
  },
  {
    title: 'Συμβάντα',
    dataIndex: 'entriesCount',
    key: 'entriesCount'
  },
  {
    title: 'Μέλη',
    dataIndex: 'membersCount',
    key: 'membersCount'
  },
  {
    title: 'Κατάσταση',
    dataIndex: 'status',
    key: 'status',
    render: (e, row) => <LogBookStatus closeDate={row.close} />
  }
]

const LogBooksView = ({ logBooks, onCreate, onDelete }) => {
  const headers = [
    ...columns,
    {
      title: 'Ενέργειες',
      key: 'action',
      render: (e, row) => (
        <div className="metis-table-actions">
          <AntdTooltip title={STRINGS.VIEW}>
            <NavLink to={`/logbooks/${row.id}`}>
              <AntdButton size="small" type="ghost" shape="circle" icon="eye" />
            </NavLink>
          </AntdTooltip>
          <AntdTooltip title={STRINGS.EDIT}>
            <NavLink to={`/logbooks/${row.id}/edit`}>
              <AntdButton
                size="small"
                type="ghost"
                shape="circle"
                icon="form"
              />
            </NavLink>
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
  ]
  return (
    <div>
      <PageHeader
        title={STRINGS.TITLE}
        subtitle={STRINGS.SUBTITLE}
        actions={[
          {
            caption: STRINGS.NEW,
            onClick: onCreate
          }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Table columns={headers} data={logBooks} />
      </div>
    </div>
  )
}

const LogBooks = () => (
  <LogBooksContainer>
    <LogBooksView />
  </LogBooksContainer>
)

export default LogBooks
