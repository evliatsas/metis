import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr'

// connection timeout if no messages received (120.000ms = 120s = 2m)
const SERVER_TIMEOUT = 2 * 60 * 1000
const RECONNECT_DELAY = 6 * 1000

async function hubConnectionBuilder(url, getTokenFn) {
  const connection = new HubConnectionBuilder()
    .withUrl(url, { accessTokenFactory: () => getTokenFn })
    .configureLogging(LogLevel.Debug)
    .build()

  connection.serverTimeoutInMilliseconds = SERVER_TIMEOUT

  async function start() {
    try {
      await connection.start()
      console.log('connected to ', url)
    } catch (err) {
      console.log(err)
      setTimeout(() => start(), RECONNECT_DELAY)
    }
  }

  connection.onclose(async () => {
    console.log('disconnected from ', url)
    console.log('reconnecting...')
    await start()
  })

  await start()

  return connection
}

export default hubConnectionBuilder
