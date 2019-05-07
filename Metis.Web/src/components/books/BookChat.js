import React, { useState, useRef, useEffect } from 'react'
import { Icon, Input, Tooltip, Timeline, Typography as T } from 'antd'
import moment from 'moment'
import { getCurrentMember } from '../../services/CommonFunctions'
const currentUser = getCurrentMember()
const BookChat = () => {
    const [messages, setMessages] = useState([{
        name: 'Τασος', date: '2019-04-29', message: 'Καλημερα'
    }])
    const chatmessages = useRef();
    const messageRef = useRef();

    const messageHandler = () => {
        const m = {
            name: currentUser.name, date: new Date(),
            message: messageRef.current.input.state.value
        }
        messageRef.current.input.state.value = ''
        setMessages([...messages, m])
    }
    const clearMessages = () => {
        setMessages([])
    }
    
    useEffect(() => {
        chatmessages.current.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const empty = <div className="has-text-centered mt-2">
        <Icon type="wechat" style={{ fontSize: 30 }} />
        <p>Δεν υπάρχουν μηνύματα</p>
    </div>
    const hasChat = messages.length > 0 ? 'chat-flexend' : ''
    const chat = messages.map((m, i) => {
        const isCurrent = currentUser.name === m.name
        const mode = isCurrent ? 'right' : 'left'
        return <Timeline mode={mode} key={i} style={{ padding: 15, flexShrink: 0 }}>
            <Timeline.Item color="#4cc7c3" dot={<Icon type="message" theme="filled" style={{ color: '#fff ' }} />} >
                <div className="mb-2">{isCurrent ? null : <span className="has-text-primary">{m.name} </span>}
                    <T.Text type="secondary">
                        <Tooltip title={moment(m.date).format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment(m.date).fromNow()}</span>
                        </Tooltip></T.Text>
                    {isCurrent ? <span className="has-text-primary"> {m.name} </span> : null}
                </div>
                <span className="chat-message">{m.message}</span>
            </Timeline.Item>
        </Timeline>
    })
    const content = messages.length === 0 ? empty : chat;
    return (
        <div className={'chat-sidedrawer ' + hasChat}>
            <div className="chat-header"><span className="chat-header-title">Chat</span>
                <span className="is-link is-right" onClick={clearMessages}>καθαρισμός</span></div>
            <div className="chat-messages">
                {content}
                <div ref={chatmessages} />
            </div>
            <Input.Search className="chat-input"
                placeholder="Το μηνυμά σας"
                enterButton={<Icon type="caret-right" />}
                size="large"
                ref={messageRef}
                onSearch={messageHandler}
            />
        </div>
    )
}

export default BookChat;