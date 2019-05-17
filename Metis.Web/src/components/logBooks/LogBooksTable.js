import React from 'react'
import { NavLink } from 'react-router-dom'
import { Table as AntdTable, Divider as AntdDivider } from 'antd'
import moment from 'moment'
import LogBookStatus from './LogBookStatus'
import './logBooks.css'

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
      <span>
        <NavLink to={`/logbooks/${row.id}/edit`}>{STRINGS.EDIT}</NavLink>
        <AntdDivider type="vertical" />
        <NavLink to={`/logbooks/${row.id}`}>{STRINGS.VIEW}</NavLink>
      </span>
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
