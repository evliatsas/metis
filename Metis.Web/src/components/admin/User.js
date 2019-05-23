import React from 'react'
import UserContainer from '../containers/admin/UserContainer'
import PageHeader from '../shared/PageHeader'

const STRINGS = {
  SUBTITLE_NEW: 'δημιουργία χρήστη',
  SUBTITLE_EDIT: 'επεξεργασία χρήστη',
  SAVE: 'Αποθήκευση',
  CANCEL: 'Ακύρωση'
}

const UserView = ({ user, sites, onSave, onCancel, onBack }) => {
  if (!user) {
    return null
  }
  return (
    <div>
      <PageHeader
        title={user.title}
        subtitle={user.id ? STRINGS.SUBTITLE_EDIT : STRINGS.SUBTITLE_NEW}
        onBack={onBack}
        actions={[
          {
            caption: STRINGS.SAVE,
            onClick: onSave
          },
          {
            caption: STRINGS.CANCEL,
            onClick: onCancel
          }
        ]}
      />
      {JSON.stringify(user)}
    </div>
  )
}

const User = () => (
  <UserContainer>
    <UserView />
  </UserContainer>
)

export default User
