import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../services/api'

const LogBookContainer = props => {
  const { id } = props.match.params
  const { children } = props
  const [logBook, setLogBook] = useState(null)

  useEffect(() => {
    async function fetchLogBook() {
      const response = await api.get(`/api/logbooks/${id}`)
      setLogBook(response)
    }

    fetchLogBook()
  }, [id])

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      logBook
    })
  )
}

export default withRouter(LogBookContainer)
