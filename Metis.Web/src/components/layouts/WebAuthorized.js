import React, { lazy, Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Layout as AntdLayout } from 'antd'
import WebSidebar from './WebSidebar'

const Map = lazy(() => import('../map/WebMapLayout'))

const WebAuthorized = () => {
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <AntdLayout>
        <WebSidebar />
        <AntdLayout.Content style={{ height: '100vh' }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path="/map" component={Map} />
              <Redirect to="/map" />
            </Switch>
          </Suspense>
        </AntdLayout.Content>
      </AntdLayout>
    </div>
  )
}

export default WebAuthorized
