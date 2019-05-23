import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../../services/api'

const UserContainer = props => {
  const { id } = props.match.params
  const { children, history } = props
  const [user, setUser] = useState(null)
  const [sites, setSites] = useState([])

  async function onSave() {
    if (user.id) {
      await api.post(`/api/admin/users`, user)
    } else {
      await api.put(`/api/admin/users/${id}`, user)
    }

    onBack()
  }

  function onBack() {
    history.push(`/api/admin/users`)
  }

  function onCancel() {
    onBack()
  }

  async function onDelete() {
    await api.delete(`/api/admin/users/${id}`)
    history.push('/api/admin/users')
  }

  useEffect(() => {
    async function fetchUser() {
      const response = await api.get(`/api/admin/user/${id}`)
      setUser(response)
    }
    async function fetchSites() {
      const response = await api.get('/api/sites')
      setSites(response)
    }
    fetchUser()
    fetchSites()
  }, [id])

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      user,
      sites,
      onCancel,
      onSave,
      onDelete
    })
  )
}

export default withRouter(UserContainer)
