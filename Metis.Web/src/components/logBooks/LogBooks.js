import React from 'react'
import LogBooksContainer from '../containers/LogBooksContainer'
import LogBooksHeader from './LogBooksHeader'
import LogBooksTable from './LogBooksTable'
import './logBooks.less'

const LogBooksView = ({ logBooks, onCreate }) => {
  return (
    <div>
      <LogBooksHeader onCreate={onCreate} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LogBooksTable logBooks={logBooks} />
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
