import React from 'react'
import UserContainer from '../containers/admin/UserContainer'

const UserView = ({ user, sites, onSave, onCancel }) => {
  return <div>{JSON.stringify(user)}</div>
}

const User = () => (
  <UserContainer>
    <UserView />
  </UserContainer>
)

export default User
