import { useEffect, useState } from 'react'
import {
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel
} from '@aspnet/signalr'

// const connection = new HubConnectionBuilder()
//   .withUrl(config.urls.srv + '/chat', {
//     transport: HttpTransportType.WebSockets,
//     accessTokenFactory: () => localStorage.getItem('token')
//   })
//   .configureLogging(LogLevel.Information)
//   .build()
// connection.serverTimeoutInMilliseconds = 2 * 60 * 1000
// connection.onclose(() => {
//   setTimeout(() => connection.start(), 60000)
// })

function useConnection(url, token) {
  const [connection, setConnection] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const _connection = new HubConnectionBuilder()
      .withUrl(url, {
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => token
      })
      .configureLogging(LogLevel.Information)
      .build()
      .start()
      .then(() => {
        console.log('connected')
      })
      .catch(err => {
        setError(err)
        console.error(err)
      })

    _connection.onclose(() => {
      connection.start()
    })

    setConnection(_connection)

    return () => {
      connection.stop()
    }
  }, [url, token, connection])

  return {
    connection,
    error
  }
}

export default useConnection
