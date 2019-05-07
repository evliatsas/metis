import React, { useState, useEffect } from 'react'
import { Table, Row, Col, PageHeader, Divider } from 'antd'
import { NavLink } from 'react-router-dom'
import api from '../../services/api'
import { calculateStatus } from '../../services/CommonFunctions'
import moment from 'moment'
const formItemLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 20 },
  xxl: { span: 18 }
}
const Books = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const columns = [
    {
      title: 'Τίτλος',
      dataIndex: 'name',
      key: 'name',
      render: (e, row) => (
        <NavLink to={'/book/monitor/' + row.id}>{row.name}</NavLink>
      )
    },
    {
      title: 'Δημιουργήθηκε',
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
      render: (e, row) => calculateStatus(row.close)
    },
    {
      title: 'Ενέργειες',
      key: 'action',
      render: (e, row) => (
        <span>
          <NavLink to={'/book/' + row.id}>επεξεργασία</NavLink>
          <Divider type="vertical" />
          <NavLink to={'/book/monitor/' + row.id}>προβολή</NavLink>
        </span>
      )
    }
  ]

  useEffect(() => {
    api.get('/api/logbooks').then(res => {
      setData(res)
      setLoading(false)
    })
  }, [])

  return (
    <Row type="flex" justify="center">
      <Col span={24}>
        <PageHeader
          subTitle=" Σύντομη ανασκόπηση συμβάντων ταξινομημένα κατα ημερομηνία"
          title="Συμβάντα"
          onBack={() => window.history.back()}
        />
      </Col>
      <Col {...formItemLayout} className="mt-2">
        <Table loading={loading} rowKey="id" columns={columns} dataSource={data} />
      </Col>
    </Row>
  )
}

export default Books
