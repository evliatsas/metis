import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr'

async function hubConnectionBuilder(url, getTokenFn) {
  const connection = new HubConnectionBuilder()
    .withUrl(url, { accessTokenFactory: () => getTokenFn })
    .configureLogging(LogLevel.Information)
    .build()

  connection.serverTimeoutInMilliseconds = 2 * 60 * 1000

  async function start() {
    try {
      await connection.start()
      console.log('connected to ', url)
    } catch (err) {
      console.log(err)
      setTimeout(() => start(), 6000)
    }
  }

  connection.on('SiteStatusChanged', message => {
    console.log('raw con', message)
  })

  connection.on('SiteGuardingException', message => {
    console.log('raw con', message)
  })

  connection.onclose(async () => {
    console.log('disconnected from ', url)
    console.log('reconnecting...')
    await start()
  })

  await start()

  return connection
}

export default hubConnectionBuilder
