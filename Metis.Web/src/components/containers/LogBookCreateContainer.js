import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../services/api'

const LogBookCreateContainer = props => {
  const { children, history } = props
  const [logBook, setLogBook] = useState(null)
  const [users, setUsers] = useState([])

  function onBack() {
    history.push('/logbooks')
  }

  async function onSave() {
    const created = await api.post(`/api/logbooks`, logBook)
    console.log(created)
    if (created) {
      history.push(`/logbooks/${created.id}`)
    }
  }

  function onCancel() {
    onBack()
  }

  useEffect(() => {
    async function fetchNewLogBook() {
      const response = await api.get('/api/logbooks/new')
      setLogBook(response)
    }

    async function fetchUsers() {
      const response = await api.get('/api/logbooks/members')
      setUsers(response)
    }
    fetchNewLogBook()
    fetchUsers()
  }, [])

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      logBook,
      users,
      onBack,
      onSave,
      onCancel
    })
  )
}

export default withRouter(LogBookCreateContainer)
