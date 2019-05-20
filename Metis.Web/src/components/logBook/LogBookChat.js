import React, { useState, useEffect, useRef } from 'react'
import { Input, Button } from 'antd'
import LogBookChatMessage from './LogBookChatMessage'
import './logBook.less'

const LogBookChat = ({ messages, onSend }) => {
  const messagesRef = useRef(null)
  const [message, setMessage] = useState('')

  function handleSend() {
    onSend(message)
    setMessage('')
  }

  function handleKeyDown(evt) {
    if (evt.key === 'Enter') {
      handleSend()
    }
  }

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, messagesRef])

  return (
    <div className="logbook-chat">
      <div ref={messagesRef} className="logbook-chat-message-list">
        {messages.map((msg, idx) => (
          <LogBookChatMessage
            key={idx}
            author={msg.sender.title}
            sent={msg.sent}
            message={msg.message}
          />
        ))}
      </div>

      <div style={{ display: 'flex' }}>
        <Input
          size="large"
          value={message}
          onChange={evt => setMessage(evt.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          size="large"
          type="ghost"
          icon="message"
          onClick={handleSend}
          disabled={!message}
        />
      </div>
    </div>
  )
}

export default LogBookChat
