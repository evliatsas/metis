import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../services/api'

const LogBooksContainer = props => {
  const { children, history } = props
  const [logBooks, setLogBooks] = useState([])

  function onCreate() {
    history.push('/logbooks/new')
  }

  useEffect(() => {
    async function fetchLogBooks() {
      const response = await api.get('/api/logbooks')
      setLogBooks(response)
    }

    fetchLogBooks()
  }, [])

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      logBooks,
      onCreate
    })
  )
}

export default withRouter(LogBooksContainer)
