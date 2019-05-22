import React from 'react'
import LogBookCreateContainer from '../containers/LogBookCreateContainer'
import LogBookCreateHeader from './LogBookCreateHeader'

const LogBookCreateView = ({ logBook, users, onBack, onSave, onCancel }) => {
  if (!logBook) {
    return null
  }
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <LogBookCreateHeader
        logBook={logBook}
        onBack={onBack}
        onSave={onSave}
        onCancel={onCancel}
      />
      <div style={{ height: '100%' }}>
        <div>users: {JSON.stringify(users)}</div>
        <hr />
        <div>members: {JSON.stringify(logBook.members)}</div>
      </div>
    </div>
  )
}

const LogBookCreate = () => (
  <LogBookCreateContainer>
    <LogBookCreateView />
  </LogBookCreateContainer>
)

export default LogBookCreate
