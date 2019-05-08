import React, { useState, useEffect } from 'react'
import {
  PageHeader, Popconfirm,
  DatePicker, Row, Form,
  Icon, Input, Button, Col,
  Transfer, Divider, notification
} from 'antd'
import api from '../../services/api'
import { getCurrentMember } from '../../services/CommonFunctions'
import './Books.sass'
import moment from 'moment'
const formItemLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 18 },
  xl: { span: 12 },
  xxl: { span: 10 }
}
const locale = {
  itemUnit: 'Χρήστες',
  itemsUnit: 'Χρήστες',
  searchPlaceholder: 'Αναζήτηση'
}
const member = getCurrentMember()
const Book = props => {
  const id = props.match.params.id ? props.match.params.id : null
  const title = id ? 'Επεξεργασία Συμβάν' : 'Νέο Συμβάν'
  const [usersToSelect, setUsersToSelect] = useState([])
  const [usersSelected, setUsersSelected] = useState([])
  const [book, setBook] = useState({
    close: new Date(),
    name: null
  })

  const bookHandler = event => {
    setBook({
      ...book,
      name: event.target.value
    })
  }

  const usersHandler = (nextTargetKeys) => {
    setUsersSelected(last => [...nextTargetKeys])
    setBook({
      ...book,
      members: usersToSelect.filter(f => nextTargetKeys.some(s => s === f.key))
    })
  }

  const dateHandler = d => {
    if (d._d) {
      setBook({ ...book, close: d._d })
    }
  }

  useEffect(() => {
    if (id) {
      api.get(`/api/logbooks/${id}`).then(res => {
        if (!res) {
          props.history.push(`/books`)
          return
        }
        const d = new Date(res.close)
        const m = res.members.map(x => {
          return x.userId
        })
        setUsersSelected([...m])
        setBook({
          ...res,
          close: d
        })
      })
    }
    api.get('/api/logbooks/members').then(res => res ? setUsersToSelect([...res]) : null)
  }, [id])

  const handleSubmit = evt => {
    evt.preventDefault()
    if (id) {
      api.put(`/api/logbooks/${id}`, book).then(res => {
        notification['success']({
          message: 'Επιτυχής καταχώρηση',
        })
      })
    } else {
      api.post('/api/logbooks', createBody()).then(res => {
        if (res) {
          props.history.push(`/book/${res.id}`)
          notification['success']({
            message: 'Επιτυχής καταχώρηση',
          })
        }
      })
    }
  }

  const handleDelete = () => {
    api.delete(`/api/logbooks/${id}`).then(res => {
      props.history.push('/books')
      notification['success']({
        message: 'Επιτυχής διαγραφή',
      })
    })
  }

  const deleteButton = id ? (
    <Popconfirm key="1"
      title="Θέλετε σίγουρα να διαγράψετε το αρχείο?"
      onConfirm={handleDelete}
      onCancel={null}      
      okText="Ναι"
      cancelText="Όχι">
      <Button type="danger"  size="small" className="mr-2" >διαγραφή</Button>
    </Popconfirm>
  ) : null

  const bookMonitorLink = id ? (
    <Button key="0" size="small"
      className="has-text-primary mr-2"
      onClick={() => {
        props.history.push('/book/monitor/' + id)
      }}> προβολή </Button>
  ) : null
  const createBody = () => {
    return {
      owner: member,
      close: book.date,
      members: usersToSelect.filter(f =>
        usersSelected.some(s => s === f.key)
      ),
      name: book.name
    }
  }
  return (
    <Form onSubmit={handleSubmit}>
      <Row type="flex" justify="center">
        <Col span={24}>
          <PageHeader onBack={() => window.history.back()} title={title}
           subTitle="Δημιουργία Συμβάν και προσθήκη μελών"
            extra={[
              bookMonitorLink,
              deleteButton,
              <Button key="3" type="primary" size="small" htmlType="submit">
                Αποθήκευση
            </Button>
            ]}
          />
        </Col>
        <Col {...formItemLayout} style={{ padding: 10 }} className="has-background-dark mt-2">
          <Divider>Λεπτομέρειες</Divider>
          <Form.Item label="Τίτλος">
            <Input
              prefix={<Icon type="folder-open" />}
              name="name"
              value={book.name}
              placeholder="Τίτλος Συμβάν"
              onChange={bookHandler}
            />
          </Form.Item>
          <Form.Item label="Ημ/νια Λήξης">
            <DatePicker
              value={moment(book.close, 'L')}
              placeholder="Επιλογή Ημ/νιας"
              onChange={dateHandler}
              className="is-fullwidth"
            />
          </Form.Item>
          <Divider>Επιλογή μέλών για προβολή/επεξεργασία</Divider>
          <Form.Item label="">
            <Transfer
              locale={locale}
              titles={['Επιλογή', 'Επιλεγμένοι']}
              rowKey={record => record.userId}
              dataSource={usersToSelect}
              showSearch
              listStyle={{
                height: 400
              }}
              targetKeys={usersSelected}
              onChange={usersHandler}
              render={item => `${item.name}`}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default Book
