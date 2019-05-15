import React, { Suspense, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import LayoutContainer from './components/layout/Layout'
import { AuthContext } from './contexts/AuthProvider'
import { Authorizedroutes, UnauthorizedRoutes } from './components/Routes'
import 'moment/locale/el'
import './styles/Utilities.sass'

const Routes = () => {
  const authContext = useContext(AuthContext)
  return authContext.isAuthenticated ? (
    <Authorizedroutes />
  ) : (
    <UnauthorizedRoutes />
  )
}

const App = () => {
  return (
    <LayoutContainer className="is-fullheight">
      <Suspense fallback={<p>Loading...</p>}>
        <Routes />
      </Suspense>
    </LayoutContainer>
  )
}

export default withRouter(App)
