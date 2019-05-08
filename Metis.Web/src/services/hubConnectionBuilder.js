import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr'
import storage from './storage'

// connection timeout if no messages received (120.000ms = 120s = 2m)
const SERVER_TIMEOUT = 2 * 60 * 1000
const RECONNECT_DELAY = 6 * 1000

async function hubConnectionBuilder(url) {
  const connection = new HubConnectionBuilder()
    .withUrl(url, { accessTokenFactory: () => storage.get('token') })
    .configureLogging(LogLevel.Debug)
    .build()

  connection.serverTimeoutInMilliseconds = SERVER_TIMEOUT

  async function start() {
    if (!storage.get('token')) {
      return
    }
    try {
      await connection.start()
    } catch (err) {
      console.log(err)
      setTimeout(() => start(), RECONNECT_DELAY)
    }
  }

  connection.onclose(async () => {
    //await start()
  })

  await start()

  return connection
}

export default hubConnectionBuilder
