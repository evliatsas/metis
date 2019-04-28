import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from '../components/login/Login';
import Dashboard from '../components/dashboard/Dashboard';
import MapMonitor from '../components/MapMonitor/MapMonitor';
import Books from '../components/books/Books';
import Book from '../components/books/Book';
import BookContainer from '../components/books/BookContainer'
export const fullAccess = (
    <Switch>
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/surveillance" exact component={MapMonitor} />
        <Route path="/books" exact component={Books} />
        <Route path="/book/monitor/:id" exact component={BookContainer} />
        <Route path="/book/new" exact component={Book} />
        <Route path="/book/:id" exact component={Book} />
        <Redirect to="/dashboard" />ks
    </Switch>
);

export const unAuthorized = (
    <Switch>
        <Route path="/login" exact component={Login} />
        <Redirect to="/login" />
    </Switch>
);