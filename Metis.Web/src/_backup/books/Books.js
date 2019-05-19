import React, { useState, useEffect } from 'react'
import { Table, Row, Col, PageHeader, Divider, Button, List, Typography as T } from 'antd'
import { NavLink } from 'react-router-dom'
import api from '../../services/api'
import { calculateStatus } from '../../services/CommonFunctions'
import moment from 'moment'
const formItemLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 20 },
  xxl: { span: 18 }
}
const Books = props => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const isMobile = window.innerWidth <= 760
  const columns = [
    {
      title: 'Τίτλος',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (e, row) => (
        <NavLink to={'/book/monitor/' + row.id}>{row.name}</NavLink>
      )
    },
    {
      title: 'Λήξη',
      dataIndex: 'close',
      key: 'close',
      sorter: true,
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
      sorter: true,
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
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter && sorter.field) {
      const sorted = sorter.order === "ascend" ? data.reverse(x => x[sorter.field]) :
        data.reverse(x => x[sorter.field])
      setData(last => [...sorted])
    }
  }
  useEffect(() => {
    api.get('/api/logbooks').then(res => {
      setData(res)
      setLoading(false)
    })
  }, [])

  return (
    <Row type="flex" justify="center" align="top">
      <Col span={24}>
        <PageHeader
          subTitle=" Σύντομη ανασκόπηση συμβάντων ταξινομημένα κατα ημερομηνία"
          title="Συμβάντα"
          onBack={() => window.history.back()}
          extra={[
            <Button
              key="0"
              type="default"
              size="small"
              className="has-text-primary"
              onClick={null}>
              Ανανέωση
            </Button>,
            <Button
              key="1"
              type="primary"
              size="small"
              onClick={() => props.history.push('/book/new')}>
              Προθήκη Νέου
            </Button>
          ]}
        />
      </Col>
      <Col {...formItemLayout} style={{ padding: 10 }}>
        {isMobile ? <List
          dataSource={data}
          renderItem={item => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={item.name}
                description={<div><T.Text type="secondary">Ημ/νια λήξης: {moment(item).format('L')}</T.Text>
                  <div>
                    <NavLink to={'/book/' + item.id}>επεξεργασία</NavLink>
                    <Divider type="vertical" />
                    <NavLink to={'/book/monitor/' + item.id}>προβολή</NavLink></div>
                </div>}
              />
              <div>{calculateStatus(item.close)}</div>
            </List.Item>
          )}
        >
        </List> :
          <Table loading={loading}
            rowKey={record => record.id}
            columns={columns}
            dataSource={data}
            onChange={handleTableChange}
            pagination={{ defaultPageSize: 15, hideOnSinglePage: true }}
          />}
      </Col>
    </Row>
  )
}

export default Books
