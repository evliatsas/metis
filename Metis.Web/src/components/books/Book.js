import React, { useState, useEffect } from 'react'
import {
  PageHeader,
  DatePicker,
  Row,
  Form,
  Icon,
  Input,
  Button,
  Col,
  Transfer,
  Card
} from 'antd'
import api from '../../services/api'
import { getCurrentMember } from '../../services/CommonFunctions'
import './Books.sass'
import moment from 'moment'
const formItemLayout = {
  xs: { span: 24 },
  lg: { span: 22 },
  xl: { span: 11 },
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
    date: new Date(),
    name: null
  })

  const bookHandler = event => {
    setBook({
      ...book,
      name: event.target.value
    })
  }
  const usersHandler = (nextTargetKeys, direction, moveKeys) => {
    if (direction === 'right') {
      setUsersSelected(last => [...nextTargetKeys, usersSelected])
    } else {
      setUsersSelected(last => [...nextTargetKeys])
    }
  }
  const dateHandler = d => {
    if (!d._d) {
      return
    }
    setBook({ ...book, date: d._d })
  }

  useEffect(() => {
    // TODO: @Nikos den katalavainw th logikh sou edw
    if (!id) {
      return
    }

    // TODO: @Nikos den katalavainw th logikh sou edw
    api.get(`/api/logbooks/${id}`).then(res => {
      const d = new Date(res.close)
      const m = res.members.map(x => {
        return x.userId
      })
      setUsersSelected([...m])
      setBook({
        ...res,
        date: d
      })
    })

    // TODO: @Nikos den katalavainw th logikh sou edw
    api.get('/api/logbooks').then(res => setUsersToSelect([...res]))
  }, [id])

  const handleSubmit = evt => {
    evt.preventDefault()

    if (id) {
      api.put(`/api/logbooks/${id}`, book).then(res => {
        props.history.push(`/book/${res.id}`)
      })
    } else {
      api.post('/api/logbooks', createBody()).then(res => {
        props.history.push(`/book/${res.id}`)
      })
    }
  }

  const handleDelete = () => {
    api.delete(`/api/logbooks/${id}`).then(res => {
      props.history.push('/books')
    })
  }

  const deleteButton = id ? (
    <Button type="danger" className="mr-2 is-right" onClick={handleDelete}>
      Διαγραφή
    </Button>
  ) : null
  const bookMonitorLink = id ? (
    <Button
      className="has-text-primary mr-2 is-right"
      onClick={() => {
        props.history.push('/book/monitor/' + id)
      }}>
      {' '}
      Προβολή
    </Button>
  ) : null
  const createBody = () => {
    if (id) {
      setBook({
        ...book,
        members: usersToSelect.filter(f => usersSelected.some(s => s === f.key))
      })
    } else {
      return {
        owner: member,
        close: book.date,
        members: usersToSelect.filter(f =>
          usersSelected.some(s => s === f.key)
        ),
        name: book.name
      }
    }
  }
  return (
    <Form onSubmit={handleSubmit}>
      <Row type="flex" justify="center" gutter={16}>
        <Col span={24}>
          <PageHeader onBack={() => window.history.back()} title={title} />
        </Col>
        <Col {...formItemLayout} className="mt-2">
          <Card title="Λεπτομέρειες" size="small">
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
                value={moment(book.date, 'L')}
                placeholder="Επιλογή Ημ/νιας"
                onChange={dateHandler}
                className="is-fullwidth"
              />
            </Form.Item>
            <Button type="primary is-right" htmlType="submit">
              Αποθήκευση
            </Button>
            {deleteButton}
            {bookMonitorLink}
          </Card>
        </Col>
        <Col {...formItemLayout} className="mt-2">
          <Card title="Επιλογή μέλών για προβολή/επεξεργασία" size="small">
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
          </Card>
        </Col>
      </Row>
    </Form>
  )
}

export default Book
