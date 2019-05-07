import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../auth/AuthProvider'
import storage from '../services/storage'
import hubConnectionBuilder from './hubConnectionBuilder'

const apiUrl = process.env.REACT_APP_API_URL

export const GuardHubContext = React.createContext({
  isConnected: false,
  connection: null
})

const GuardHubProvider = ({ children }) => {
  const auth = useContext(AuthContext)
  const [isConnected, setIsConnected] = useState(false)
  const [connection, setConnection] = useState(null)

  useEffect(() => {
    setIsConnected(connection !== null)

    if (!auth.isAuthenticated) {
      return
    }

    if (connection) {
      return
    }

    hubConnectionBuilder(`${apiUrl}/guard`, storage.get('token')).then(con => {
      setConnection(con)
    })

    return () => {
      if (connection) {
        connection.close()
        console.log('connection to guard hub closed')
      }
    }
  }, [connection, auth.isAuthenticated])

  return (
    <GuardHubContext.Provider value={{ isConnected, connection }}>
      {children}
    </GuardHubContext.Provider>
  )
}

export default GuardHubProvider
