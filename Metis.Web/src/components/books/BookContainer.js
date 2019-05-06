import React, { useEffect, useState } from 'react'
import { Row, Col, PageHeader, Tabs, Button } from 'antd'
import LogEntry from './LogEntry'
import BookEntries from './BookEntries'
import BookChat from './BookChat'
import { callFetch } from '../../services/HttpService'
import moment from 'moment'
import { calculateStatus } from '../../services/CommonFunctions'
import BookMembers from './BookMembers'
const TabPane = Tabs.TabPane

const BookContainer = props => {
  const id = props.match.params.id ? props.match.params.id : null
  const [book, setBook] = useState({ members: [], entries: [] })
  const [logEntry, setLogEntry] = useState(null)
  const [tabIndex, setTabIndex] = useState("1")

  useEffect(() => {
    if (id) {
      callFetch('logbooks/' + id, 'GET').then(res => {
        if (res) {
          setBook(res)
        }
      })
    }
  }, [])
  const handleLogEntry = (entry) => {  
    if (!entry) { setLogEntry(null) }   
    setLogEntry(entry)
  }
  const handleTabIndex = (key) => {
    setTabIndex(key)
  }

  const logEntryModal = logEntry ? <LogEntry data={logEntry}
    onClose={(e) => handleLogEntry(e)} /> : null

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
              onClick={() => handleLogEntry({ 'logBookId': id })}>
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
            <Tabs defaultActiveKey={tabIndex} onChange={handleTabIndex}>
              <TabPane tab="Γεγονότα" key="1" />
              <TabPane tab="Μέλη" key="2" />
            </Tabs>
          }
        />
      </Col>
      <Col span={16}>
        {tabIndex == "1" ? <BookEntries data={book.entries} edit={(l) => handleLogEntry(l)} /> :
          <BookMembers members={book.members} />}
      </Col>
      <Col span={8} className="chat-container">
        <BookChat />
      </Col>
      {logEntryModal}
    </Row>
  )
}

export default BookContainer
