import React, { useState, useEffect } from 'react'
import api from '../../services/api'

const LogBooksContainer = ({ children }) => {
  const [logBooks, setLogBooks] = useState([])

  useEffect(() => {
    async function fetchLogBooks() {
      const response = await api.get('/api/logbooks')
      setLogBooks(response)
    }

    fetchLogBooks()
  }, [])

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      logBooks
    })
  )
}

export default LogBooksContainer
