import React from 'react'
import LogBookContainer from '../containers/LogBookContainer'
import LogBookHeader from './LogBookHeader'
import LogBookChat from './LogBookChat'
import LogBookEntriesTable from './LogBookEntriesTable'

const LogBookView = ({
  logBook,
  members,
  messages,
  sendMessage,
  onBack,
  onEdit,
  onCreate,
  onBookEntryDelete
}) => {
  if (!logBook) {
    return null
  }
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <LogBookHeader
        logBook={logBook}
        onBack={onBack}
        onEdit={onEdit}
        onCreate={onCreate}
      />
      <div style={{ display: 'flex', height: '100%' }}>
        <div className="logbook-body">
          <LogBookEntriesTable onEdit={onEdit} onDelete={onBookEntryDelete} entries={logBook.entries} />
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
