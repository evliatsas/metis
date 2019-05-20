import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../services/api'
import hubConnectionBuilder from '../../services/hubConnectionBuilder'

const HUB_URL = `${process.env.REACT_APP_API_URL}/chat`

const LogBookContainer = props => {
  const { id } = props.match.params
  const { children } = props
  const hub = useRef(null)
  const [logBook, setLogBook] = useState(null)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    async function fetchLogBook() {
      const response = await api.get(`/api/logbooks/${id}`)
      setLogBook(response)
    }

    async function fetchMessages() {
      const response = await api.get(`/api/logbooks/${id}/messages`)
      const sorted = response.sort((a, b) => (a.sent > b.sent ? 1 : -1))
      setMessages(sorted)
    }

    fetchLogBook()
    fetchMessages()

    hubConnectionBuilder(HUB_URL)
      .then(con => {
        hub.current = con

        hub.current.on('userConnected', (username, title, email) => {
          console.log('userConnected', username, title, email)
        })

        hub.current.on('userDisconnected', (username, title, email) => {
          console.log('userDisconnected', username, title, email)
        })

        hub.current.on('received', (username, title, message) => {
          setMessages(prevMessages => [
            ...prevMessages,
            {
              sender: { username: username, title: title },
              sent: new Date().toISOString(),
              message: message
            }
          ])
        })
      })
      .catch(err => {
        console.error(err)
        hub.current = null
      })

    return () => {
      if (hub.current) {
        hub.current.stop()
        hub.current = null
      }
    }
  }, [id])

  async function sendMessage(message) {
    if (!hub.current) {
      return
    }
    hub.current.invoke('Send', id, message)
  }

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      logBook,
      messages,
      sendMessage
    })
  )
}

export default withRouter(LogBookContainer)
