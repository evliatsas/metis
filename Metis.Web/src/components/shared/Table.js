import React from 'react'
import { Table as AntdTable } from 'antd'
import './shared.less'

const Table = ({ columns, data, keySelector = item => item.id }) => (
  <AntdTable
    className="metis-table"
    rowKey={item => item.id}
    columns={columns}
    dataSource={data}
    pagination={{ defaultPageSize: 10, hideOnSinglePage: true }}
  />
)

export default Table
