import React, { lazy, Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Layout as AntdLayout } from 'antd'

const Map = lazy(() => import('../map/MobileMapLayout'))
const LogBooks = lazy(() => import('../logBooks/LogBooks'))
const LogBook = lazy(() => import('../logBooks/LogBook'))

const MobileAuthorized = () => {
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <AntdLayout>
        <AntdLayout.Content style={{ height: '100vh' }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path="/map" component={Map} />
              <Route exact path="/logbooks" component={LogBooks} />
              <Route exact path="/logbooks/:id" component={LogBook} />
              <Redirect to="/map" />
            </Switch>
          </Suspense>
        </AntdLayout.Content>
      </AntdLayout>
    </div>
  )
}

export default MobileAuthorized
