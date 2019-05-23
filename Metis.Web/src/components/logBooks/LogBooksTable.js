import React from 'react'
import { NavLink } from 'react-router-dom'
import { Table as AntdTable, Divider as AntdDivider, Button as AntdButton } from 'antd'
import moment from 'moment'
import LogBookStatus from './LogBookStatus'
import './logBooks.less'

const STRINGS = {
  EDIT: 'επεξεργασία',
  VIEW: 'προβολή'
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
    title: 'Γεγονότα',
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
  },
  {
    title: 'Ενέργειες',
    key: 'action',
    render: (e, row) => (
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <NavLink to={`/logbooks/${row.id}/edit`}>
          <AntdButton
            size="small"
            type="ghost"
            shape="circle"
            icon="form"
          />
        </NavLink>
        <NavLink to={`/logbooks/${row.id}`}>
          <AntdButton
            size="small"
            type="ghost"
            shape="circle"
            icon="eye"
          />
        </NavLink>
      </div>
    )
  }
]

const LogBooksTable = ({ logBooks }) => {
  return (
    <AntdTable
      className="logbooks-table"
      //loading={loading}
      rowKey={item => item.id}
      columns={columns}
      dataSource={logBooks}
      //onChange={handleTableChange}
      pagination={{ defaultPageSize: 15, hideOnSinglePage: true }}
    />
  )
}

export default LogBooksTable
