import React from 'react'
import LogBookCreateContainer from '../containers/LogBookCreateContainer'
import LogBookCreateHeader from './LogBookCreateHeader'

const LogBookCreateView = ({ logBook, onBack, onSave, onCancel }) => {
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
      <div style={{ display: 'flex', height: '100%' }}>
        <div>form</div>
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
