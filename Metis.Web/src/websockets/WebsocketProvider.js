import React from 'react'

export const WebsocketContext = React.createContext({
  isConnected: false,
  connection: null,
  start: () => {},
  stop: () => {}
})

const WebsocketProvider = props => {
  return (
    <WebsocketContext.Provider value={{}}>
      {props.children}
    </WebsocketContext.Provider>
  )
}

export default WebsocketProvider
