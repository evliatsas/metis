import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Login from './login/Login'
import Dashboard from './dashboard/Dashboard'
import MapContainer from './map/MapContainer'
import Books from './books/Books'
import Book from './books/Book'
import BookContainer from './books/BookContainer'

export const Authorizedroutes = () => (
  <Switch>
    <Route path="/dashboard" exact component={Dashboard} />
    <Route path="/map" exact component={MapContainer} />
    <Route path="/books" exact component={Books} />
    <Route path="/book/monitor/:id" exact component={BookContainer} />
    <Route path="/book/new" exact component={Book} />
    <Route path="/book/:id" exact component={Book} />
    <Redirect to="/dashboard" />
  </Switch>
)

export const UnauthorizedRoutes = () => (
  <Switch>
    <Route path="/login" exact component={Login} />
    <Redirect to="/login" />
  </Switch>
)
