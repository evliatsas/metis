import { notification } from 'antd'

const api = process.env.REACT_APP_API_URL + 'api/'
export const callFetch = async (url, method, data) => {
  const result = await await fetch(api + url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : null
  })
    .then(async res => {
      if (res.ok) {
        return res.json()
      } else {
        const message = await res.json()
        notification['error']({
          message: 'Σφάλμα',
          description: message.Message
        })
        return null
      }
    })
    .catch(() => {
      // to do error handling
    })

  return result
}
