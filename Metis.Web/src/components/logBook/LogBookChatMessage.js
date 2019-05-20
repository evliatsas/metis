import React from 'react'
import { Comment, Avatar } from 'antd'
import moment from 'moment'

function stringToHslColor(str, s, l) {
  var hash = 0
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  var h = hash % 360
  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)'
}

const LogBookChatMessage = ({ author, sent, message }) => (
  <Comment
    className="logbook-chat-message"
    avatar={
      <Avatar style={{ backgroundColor: stringToHslColor(author, 50, 50) }}>
        {author
          .split(' ')
          .map(s => s.substr(0, 1))
          .join('')}
      </Avatar>
    }
    author={author}
    datetime={moment(sent).fromNow()}
    content={<p>{message}</p>}
  />
)

export default LogBookChatMessage
