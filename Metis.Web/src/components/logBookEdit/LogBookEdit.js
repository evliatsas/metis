import React from 'react'
import LogBookEditContainer from '../containers/LogBookEditContainer'
import LogBookEditHeader from './LogBookEditHeader'

const LogBookEditView = ({ logBook, onBack, onSave, onCancel }) => {
  if (!logBook) {
    return null
  }
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <LogBookEditHeader
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

const LogBookEdit = () => (
  <LogBookEditContainer>
    <LogBookEditView />
  </LogBookEditContainer>
)

export default LogBookEdit
