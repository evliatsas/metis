import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../../services/api'

const UsersContainer = props => {
  const { children, history } = props
  const [users, setUsers] = useState([])

  function onCreate() {
    history.push('/admin/users/new')
  }

  function onEdit(user) {
    history.push(`/admin/users/${user.id}`)
  }

  function onDelete(user) {
    console.log('delete', user)
  }

  useEffect(() => {
    async function fetchUsers() {
      const _users = await api.get('/api/admin/users')
      const _sites = await api.get('/api/sites')
      _users.forEach(u => {
        u.sites = _sites.filter(s => u.sites.indexOf(s.id) !== -1)
      })
      setUsers(_users)
    }

    fetchUsers()
  }, [])

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      users,
      onCreate,
      onEdit,
      onDelete
    })
  )
}

export default withRouter(UsersContainer)
