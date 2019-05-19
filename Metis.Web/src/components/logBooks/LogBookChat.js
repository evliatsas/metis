import React, { useState } from 'react'
import { Input, Button } from 'antd'

const LogBookChat = ({ onSend }) => {
  const [message, setMessage] = useState('')
  return (
    <div>
      <Input value={message} onChange={evt => setMessage(evt.target.value)} />
      <Button type="primary" onClick={() => onSend(message)}>
        Send
      </Button>
    </div>
  )
}

export default LogBookChat
