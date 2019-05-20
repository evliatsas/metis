import React from 'react'
import { Comment } from 'antd'
import moment from 'moment'

const LogBookChatMessage = ({ author, sent, message }) => (
  <Comment
    author={author}
    datetime={moment(sent).fromNow()}
    content={<p>{message}</p>}
  />
)

export default LogBookChatMessage
