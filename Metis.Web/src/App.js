import React, { useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { AuthContext } from './contexts/AuthProvider'
import WebUnauthorized from './components/layouts/WebUnauthorized'
import WebAuthorized from './components/layouts/WebAuthorized'

const App = () => {
  const auth = useContext(AuthContext)
  if (!auth.isAuthenticated) {
    return <WebUnauthorized />
  }
  return <WebAuthorized />
}

export default withRouter(App)
