import React from 'react'
import LogBookContainer from '../containers/LogBookContainer'
import LogBookHeader from './LogBookHeader'
import LogBookChat from './LogBookChat'

const LogBookView = ({ logBook, sendMessage }) => {
  if (!logBook) {
    return null
  }
  return (
    <div>
      <LogBookHeader logBook={logBook} />
      <div>
        <div>{JSON.stringify(logBook)}</div>
      </div>
      <div>
        <LogBookChat onSend={sendMessage} />
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
