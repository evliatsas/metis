import React from 'react'
import LogBooksContainer from '../containers/LogBooksContainer'
import LogBooksHeader from './LogBooksHeader'
import LogBooksCardList from './LogBooksCardList'
import './logBooks.css'

const LogBooksView = ({ logBooks }) => {
  return (
    <div>
      <LogBooksHeader />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LogBooksCardList logBooks={logBooks} />
      </div>
    </div>
  )
}

const LogBooks = () => (
  <LogBooksContainer>
    <LogBooksView />
  </LogBooksContainer>
)

export default LogBooks
