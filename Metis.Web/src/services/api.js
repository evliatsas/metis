import { notification as antdNotification } from 'antd'
import storage from './storage'

const baseUrl = process.env.REACT_APP_API_URL

function getHeaders() {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  const token = storage.get('token')
  if (token) {
    headers.append('Authorization', `Bearer ${token}`)
  }
  return headers
}

async function getJson(req) {
  try {
    return await req.json()
  } catch (err) {
    return null
  }
}

async function request({ method, url, data }) {
  try {
    const req = await fetch(baseUrl + url, {
      method: method,
      headers: getHeaders(),
      body: data && JSON.stringify(data)
    })

    const res = await getJson(req)

    if (!req.ok) {
      throw new Error(
        (res && res.Message) || `${req.statusText} (${req.status})`
      )
    }
    return res
  } catch (err) {
    antdNotification['error']({
      placement: 'bottomRight',
      message: 'Σφάλμα',
      description: err.message
    })
    return null
  }
}

const api = {
  get: async url => await request({ method: 'GET', url }),
  post: async (url, data) => await request({ method: 'POST', url, data }),
  put: async (url, data) => await request({ method: 'PUT', url, data }),
  patch: async (url, data) => await request({ method: 'PATCH', url, data }),
  delete: async url => await request({ method: 'DELETE', url })
}

export default api
