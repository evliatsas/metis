import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../services/api'

const LogBookEditContainer = props => {
  const { id } = props.match.params
  const { children, history } = props
  const [logBook, setLogBook] = useState(null)
  const [users, setUsers] = useState([])
  function onBack() {
    history.push('/logbooks')
  }

  async function onSave() {
    await api.put(`/api/logbooks/${id}`, logBook)
    const response = await api.get(`/api/logbooks/${id}`)
    setLogBook(response)
  }

  async function onDelete() {
    await api.delete(`/api/logbooks/${id}`)
    history.push(`/logbooks`)
  }

  const logBookHandler = newValue => {
    setLogBook({ ...newValue })
  }

  function onCancel() {
    history.push(`/logbooks/${id}`)
  }

  useEffect(() => {
    async function fetchLogBook() {
      const response = await api.get(`/api/logbooks/${id}`)
      setLogBook(response)
    }
    async function fetchUsers() {
      const response = await api.get('/api/logbooks/members')
      setUsers(response)
    }
    fetchUsers()
    fetchLogBook()
  }, [id])

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      logBook,
      onBack,
      onSave,
      onCancel,
      users,
      logBookHandler,
      onDelete
    })
  )
}

export default withRouter(LogBookEditContainer)
