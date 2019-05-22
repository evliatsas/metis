import React, { lazy, Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Layout as AntdLayout } from 'antd'
import MobileMenu from './MobileMenu';
import '../../styles/index.less'
const Map = lazy(() => import('../map/MobileMapLayout'))
const LogBooks = lazy(() => import('../logBooks/LogBooks'))
const LogBook = lazy(() => import('../logBook/LogBook'))

const MobileAuthorized = () => {
  return (<React.Fragment>
    <AntdLayout className="mobile-layout" style={{ overflow: 'hidden' }}>
      <AntdLayout.Content>
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
    <MobileMenu />
  </React.Fragment>
  )
}

export default MobileAuthorized
