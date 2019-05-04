import React, { useEffect, useState } from 'react'
import { Row, Col, PageHeader, Tabs, Button, Modal } from 'antd'
import LogEntry from './LogEntry'
import BookEntries from './BookEntries'
import BookChat from './BookChat'
import { callFetch } from '../../services/HttpService'
import moment from 'moment'
import { calculateStatus } from '../../services/CommonFunctions'
const TabPane = Tabs.TabPane

const BookContainer = props => {
  const id = props.match.params.id ? props.match.params.id : null
  const [book, setBook] = useState({ members: [], entries: [] })
  const [logEntry, setLogEntry] = useState(null)

  useEffect(() => {
    if (id) {
      callFetch('logbooks/' + id, 'GET').then(res => {
        console.log(res)
        setBook(res)
      })
    }
  }, [])

  const handleLogEntry = entry => {
    setLogEntry(entry)
  }

  const lastupdate = moment(book.lastUpdate).fromNow()
  return (
    <Row className="is-fullheight">
      <Col span={24}>
        <PageHeader
          onBack={() => window.history.back()}
          title={book.name}
          subTitle={lastupdate + ' ενημερώθηκε'}
          tags={calculateStatus(book.close)}
          extra={[
            <Button
              key="1"
              className="has-text-primary"
              size="small"
              onClick={() => handleLogEntry({})}>
              {' '}
              Νεο Γεγονός{' '}
            </Button>,
            <Button
              key="2"
              type="primary"
              size="small"
              onClick={() => props.history.push('/book/' + book.id)}>
              {' '}
              Eπεξεργασία{' '}
            </Button>
          ]}
          footer={
            <Tabs defaultActiveKey="1">
              <TabPane tab="Γεγονότα" key="1" />
              <TabPane tab="Μέλη" key="2" />
            </Tabs>
          }
        />
      </Col>
      <Col span={16}>
        <BookEntries data={props.data} />
      </Col>
      <Col span={8} className="chat-container">
        <BookChat />
      </Col>
      <Modal
        title={logEntry && logEntry.id ? 'Νέο Γεγονός' : 'Επεξεργασία'}
        visible={logEntry !== null}
        onOk={null}
        onCancel={() => handleLogEntry(null)}>
        {' '}
        <LogEntry />
      </Modal>
    </Row>
  )
}

export default BookContainer
