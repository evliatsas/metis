import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from '../components/login/Login';
import Dashboard from '../components/dashboard/Dashboard';
import MapMonitor from '../components/MapMonitor/MapMonitor';
import EventsContainer from '../components/events/EventsContainer';
export const fullAccess = (
    <Switch>
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/surveillance" exact component={MapMonitor} />
        <Route path="/events" exact component={EventsContainer} />
        <Redirect to="/dashboard" />
    </Switch>
);

export const unAuthorized = (
    <Switch>
        <Route path="/login" exact component={Login} />
        <Redirect to="/login" />
    </Switch>
);