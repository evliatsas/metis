import React, { Suspense, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import LayoutContainer from './components/layout/Layout'
import { AuthContext } from './auth/AuthProvider'
import { fullAccess, unAuthorized } from './services/Routes'
import 'moment/locale/el'
import './styles/Utilities.sass'

const App = () => {
  const authContext = useContext(AuthContext)
  const routes = authContext.isAuthenticated ? fullAccess : unAuthorized

  return (
    <LayoutContainer className="is-fullheight">
      <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
    </LayoutContainer>
  )
}

export default withRouter(App)
