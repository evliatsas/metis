import React from 'react'
import LogBookContainer from '../containers/LogBookContainer'
import LogBookHeader from './LogBookHeader'
import LogBookChat from './LogBookChat'
import { Divider } from 'antd'

const LogBookView = ({ logBook, members, messages, sendMessage }) => {
  if (!logBook) {
    return null
  }
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <LogBookHeader logBook={logBook} />
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          <div>
            {JSON.stringify({
              ...logBook,
              members: undefined,
              entries: undefined
            })}
          </div>
          <Divider />
          <div>{JSON.stringify(logBook.members)}</div>
          <Divider />
          <div>{JSON.stringify(logBook.entries)}</div>
        </div>
        <LogBookChat
          members={members}
          messages={messages}
          onSend={sendMessage}
        />
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
