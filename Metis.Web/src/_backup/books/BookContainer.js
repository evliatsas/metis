import React, { useEffect, useState } from 'react'
import { Row, Col, PageHeader, Tabs, Button, notification } from 'antd'
import LogEntry from './LogEntry'
import BookEntries from './BookEntries'
import BookChat from './BookChat'
import api from '../../services/api'
import moment from 'moment'
import { calculateStatus } from '../../services/CommonFunctions'
import BookMembers from './BookMembers'
const TabPane = Tabs.TabPane

const BookContainer = props => {
  const id = props.match.params.id ? props.match.params.id : null
  const [book, setBook] = useState({ members: [], entries: [] })
  const [logEntry, setLogEntry] = useState(null)
  const [tabIndex, setTabIndex] = useState('1')

  useEffect(() => {
    if (!id) {
      return
    }
    api.get(`/api/logbooks/${id}`).then(res => {
      res ? setBook(res) : props.history.push('/books')
    })
  }, [id])

  const handleLogEntry = (entry, sumbited = false) => {
    if (sumbited && entry) {
      if (entry.id) {
        var index = book.entries.findIndex(x => x.id === entry.id)
        book.entries[index] = entry;
      } else {
        book.entries.push(entry)
      }
      setBook(book)
      entry = null
    }
    setLogEntry(entry)
  }
  const deleteEntryHandler = (l) => {
    api.delete(`/api/logbooks/${id}/entries/${l.id}`).then(res => {
      var index = book.entries.findIndex(x => x.id === l.id)
      book.entries.splice(index, 1)
      setBook({ ...book })
      notification['success']({
        message: 'Επιτυχής διαγραφή',
      })
    })
  }

  const handleTabIndex = key => {
    setTabIndex(key)
  }

  const logEntryModal = logEntry ? (
    <LogEntry data={logEntry} onClose={(entry, submited) => handleLogEntry(entry, submited)} />
  ) : null

  const lastupdate = moment(book.lastUpdate).fromNow()
  return (
    <Row className="is-fullheight">
      <Col sm={24}>
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
              onClick={() => handleLogEntry({ logBookId: id })}>
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
      <Col sm={24} md={24} lg={18} xl={19}>
        {tabIndex === '1' ? (
          <BookEntries data={book.entries} edit={l => handleLogEntry(l)}
            onDelete={(l) => deleteEntryHandler(l)} />) :
          (<BookMembers members={book.members} />
          )}
      </Col>
      <Col sm={24} md={24} lg={6} xl={5} className="chat-container">
        <BookChat />
      </Col>
      {logEntryModal}
    </Row>
  )
}

export default BookContainer
