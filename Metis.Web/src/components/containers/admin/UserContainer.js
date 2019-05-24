import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../../services/api'

const initialState = {
  username: '',
  password: '',
  email: '',
  title: 'Νέος Χρήστης',
  role: 0,
  sites: []
}

const UserContainer = props => {
  const { id } = props.match.params
  const { children, history } = props
  const [user, setUser] = useState(initialState)
  const [sites, setSites] = useState([])

  async function onSave() {
    if (user.id) {
      await api.put(`/api/admin/users/${id}`, user)
    } else {
      await api.post(`/api/admin/users`, user)     
    }

    onBack()
  }

  const userHandler = newValue => {
    setUser({ ...newValue })
  }

  function onBack() {
    history.push('/admin/users')
  }

  function onCancel() {
    onBack()
  }

  async function onDelete() {
    await api.delete(`/api/admin/users/${id}`)
    history.push('/admin/users')
  }

  useEffect(() => {
    async function fetchUser() {
      if (id === 'new') {
        return
      }
      const response = await api.get(`/api/admin/users/${id}`)
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
      onBack,
      onCancel,
      onSave,
      onDelete,
      userHandler
    })
  )
}

export default withRouter(UserContainer)
