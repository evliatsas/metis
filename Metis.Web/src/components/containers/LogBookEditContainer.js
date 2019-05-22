import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../services/api'

const LogBookEditContainer = props => {
  const { id } = props.match.params
  const { children, history } = props
  const [logBook, setLogBook] = useState(null)

  function onBack() {
    history.push('/logbooks')
  }

  async function onSave() {
    const saved = await api.put(`/api/logbooks/${id}`, logBook)
    setLogBook(saved)
  }

  function onCancel() {
    history.push(`/logbooks/${id}`)
  }

  useEffect(() => {
    async function fetchLogBook() {
      const response = await api.get(`/api/logbooks/${id}`)
      setLogBook(response)
    }
    fetchLogBook()
  }, [id])

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      logBook,
      onBack,
      onSave,
      onCancel
    })
  )
}

export default withRouter(LogBookEditContainer)
