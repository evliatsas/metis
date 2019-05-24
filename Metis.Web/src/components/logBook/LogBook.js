import React from 'react'
import LogBookContainer from '../containers/LogBookContainer'
import PageHeader from '../shared/PageHeader'
import LogBookChat from './LogBookChat'
import LogBookEntriesTable from './LogBookEntriesTable'

const STRINGS = {
  CREATE: 'Νέο Συμβάν'
}

const LogBookView = ({
  logBook,
  members,
  messages,
  sendMessage,
  onBack,
  onEdit,
  onCreate,
  onΕntryDelete,
  onEntryClose
}) => {
  if (!logBook) {
    return null
  }
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title={logBook.name}
        subtitle={logBook.owner.name}
        onBack={onBack}
        actions={[
          {
            caption: STRINGS.CREATE,
            onClick: onCreate
          }
        ]}
      />
      <div style={{ display: 'flex', height: '100%' }}>
        <div className="logbook-body">
          <LogBookEntriesTable
            entries={logBook.entries}
            onEdit={onEdit}
            onDelete={onΕntryDelete}
            onClose={onEntryClose}
          />
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
