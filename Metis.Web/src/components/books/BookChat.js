import React, { useState, useRef } from 'react';
import { Comment, Icon, Input, Tooltip } from 'antd';
import moment from 'moment';
const BookChat = () => {
    const [messages, setMessages] = useState([{
        name: 'Τασος', date: '2019-04-29', message: 'Καλημερα'
    }]);
    const messageRef = useRef();
    const messageHandler = () => {
        const m = {
            name: 'Nikos prp', date: new Date(),
            message: messageRef.current.input.state.value
        }
        messageRef.current.input.state.value = '';
        setMessages([...messages, m])
    }
    const clearMessages = () => {
        setMessages([]);
    }
    const empty = <div style={{ textAlign: 'center' }}>
        <Icon type="wechat" style={{ fontSize: 30 }} />
        <p>Δεν υπάρχουν μηνύματα</p>
    </div>
    const hasChat = messages.length > 0 ? 'chat-flexend' : ''
    const chat = messages.map((m, i) =>
        <Comment key={i}
            avatar={(
                <Icon type="message" theme="twoTone" twoToneColor="#4cc7c3" />
            )}
            author={<span className="has-text-primary">{m.name}</span>}
            content={(
                <p>{m.message}</p>
            )}
            datetime={(
                <Tooltip title={moment(m.date).format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment(m.date).fromNow()}</span>
                </Tooltip>
            )}
        />
    )
    const content = messages.length === 0 ? empty : chat;
    return (
        <div className={'chat-sidedrawer ' + hasChat}>
            <div className="chat-header"><span className="chat-header-title">Chat</span>
                <span className="is-link is-right" onClick={clearMessages}>καθαρισμός</span></div>
            <div className="is-fullwidth">
                {content}
            </div>

            <Input.Search className="chat-input"
                placeholder="Το μηνυμά σας"
                enterButton={<Icon type="caret-right" />}
                size="large"
                ref={messageRef}
                onSearch={messageHandler}
            />
        </div>
    );
};

export default BookChat;