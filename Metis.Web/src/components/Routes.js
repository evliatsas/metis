import React, { lazy } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

const Login = lazy(() => import('./login/Login'))
const Map = lazy(() => import('./map/MapContainer'))
const LogBooks = lazy(() => import('./logBooks/LogBooks'))

export const UnauthorizedRoutes = () => (
  <Switch>
    <Route path="/login" exact component={Login} />
    <Redirect to="/login" />
  </Switch>
)

export const Authorizedroutes = () => (
  <Switch>
    <Route path="/map" exact component={Map} />
    <Route path="/books" exact component={LogBooks} />
    <Redirect to="/map" />
  </Switch>
)
