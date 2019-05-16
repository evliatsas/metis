import React, { lazy, Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

const Login = lazy(() => import('../login/Login'))

const WebUnauthorized = () => {
  return (
    <div
      style={{
        height: '100%'
      }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Redirect to="/login" />
        </Switch>
      </Suspense>
    </div>
  )
}

export default WebUnauthorized
