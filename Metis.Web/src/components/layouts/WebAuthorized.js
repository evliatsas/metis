import React, { lazy, Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Layout as AntdLayout } from 'antd'
import WebSidebar from './WebSidebar'

const Map = lazy(() => import('../map/WebMapLayout'))
const LogBooks = lazy(() => import('../logBooks/LogBooks'))
const LogBookCreate = lazy(() => import('../logBookCreate/LogBookCreate'))
const LogBook = lazy(() => import('../logBook/LogBook'))
const LogBookEdit = lazy(() => import('../logBookEdit/LogBookEdit'))
const LogBookEntry = lazy(() => import('../logBookEntry/LogBookEntryEdit'))

const UsersAdmin = lazy(() => import('../admin/Users'))
const UserAdmin = lazy(() => import('../admin/User'))
const SitesAdmin = lazy(() => import('../admin/Sites'))

const WebAuthorized = () => {
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <AntdLayout>
        <WebSidebar />
        <AntdLayout.Content style={{ height: '100vh' }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path="/map" component={Map} />
              <Route exact path="/logbooks" component={LogBooks} />
              <Route exact path="/logbooks/new" component={LogBookCreate} />
              <Route exact path="/logbooks/:id" component={LogBook} />
              <Route exact path="/logbooks/:id/edit" component={LogBookEdit} />
              <Route
                exact
                path="/logbooks/:id/event/:eventId"
                component={LogBookEntry}
              />
              <Route exact path="/admin/users" component={UsersAdmin} />
              <Route exact path="/admin/users/:id" component={UserAdmin} />
              <Route exact path="/admin/sites" component={SitesAdmin} />
              <Redirect to="/map" />
            </Switch>
          </Suspense>
        </AntdLayout.Content>
      </AntdLayout>
    </div>
  )
}

export default WebAuthorized
