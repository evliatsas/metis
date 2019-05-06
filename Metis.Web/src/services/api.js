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

    if (!req.ok) {
      throw new Error(`${req.status}: ${req.statusText}`)
    }
    const res = getJson(req)
    return res
  } catch (err) {
    console.error(err)
    return null
  }
}

const api = {
  get: async ({ url }) => await request({ method: 'GET', url }),
  post: async ({ url, data }) => await request({ method: 'POST', url, data }),
  put: async ({ url, data }) => await request({ method: 'PUT', url, data }),
  patch: async ({ url, data }) => await request({ method: 'PATCH', url, data }),
  delete: async ({ url }) => await request({ method: 'DELETE', url })
}

export default api
