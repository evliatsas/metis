import React, { Suspense, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import LayoutContainer from './components/layout/Layout'
import { AuthContext } from './auth/AuthProvider'
import { Authorizedroutes, UnauthorizedRoutes } from './services/Routes'
import 'moment/locale/el'
import './styles/Utilities.sass'

const App = () => {
  const authContext = useContext(AuthContext)
  const Routes = authContext.isAuthenticated
    ? Authorizedroutes
    : UnauthorizedRoutes

  return (
    <LayoutContainer className="is-fullheight">
      <Suspense fallback={<p>Loading...</p>}>{Routes}</Suspense>
    </LayoutContainer>
  )
}

export default withRouter(App)
