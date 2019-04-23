import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from '../components/login/Login';
import Home from '../components/layout/Home';
import MapMonitor from '../components/MapMonitor/MapMonitor';

export const fullAccess = (
    <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/eob" exact component={MapMonitor} />
        <Redirect to="/" />
    </Switch>
);

export const unAuthorized = (
    <Switch>
        <Route path="/login" exact component={Login} />
        <Redirect to="/login" />
    </Switch>
);