import React from 'react'
import { Divider } from 'antd'
import LogBookCard from './LogBookCard'
import './logBooks.css'

const STRINGS = {
  OPEN: 'Ενεργά',
  CLOSED: 'Ανενεργά'
}

function isOpen(logBook) {
  return new Date(logBook.close) >= new Date()
}

const LogBooksCardList = ({ logBooks }) => (
  <div>
    <Divider className="logbook-card-list-divider" style={{ color: 'green' }}>
      {STRINGS.OPEN}
    </Divider>
    <div className="logbooks-card-list">
      {logBooks
        .filter(x => isOpen(x))
        .map(logBook => (
          <LogBookCard key={logBook.id} logBook={logBook} />
        ))}
    </div>
    <Divider className="logbook-card-list-divider" style={{ color: 'red' }}>
      {STRINGS.CLOSED}
    </Divider>
    <div className="logbooks-card-list">
      {logBooks
        .filter(x => !isOpen(x))
        .map(logBook => (
          <LogBookCard key={logBook.id} logBook={logBook} />
        ))}
    </div>
  </div>
)

export default LogBooksCardList
