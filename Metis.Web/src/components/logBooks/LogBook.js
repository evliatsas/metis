import React from 'react'
import LogBookContainer from '../containers/LogBookContainer'
import LogBookHeader from './LogBookHeader'

const LogBookView = ({ logBook }) => {
  if (!logBook) {
    return null
  }
  return (
    <div>
      <LogBookHeader logBook={logBook} />
      <div>
        <div>{JSON.stringify(logBook)}</div>
      </div>
    </div>
  )
}

const LogBook = () => (
  <LogBookContainer>
    <LogBookView />
  </LogBookContainer>
)

export default LogBook
