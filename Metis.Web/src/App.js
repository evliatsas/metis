import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useLayout } from './contexts/LayoutProvider'
import WebUnauthorized from './components/layouts/WebUnauthorized'
import WebAuthorized from './components/layouts/WebAuthorized'
import MobileAuthorized from './components/layouts/MobileAuthorized'
import MobileUnauthorized from './components/layouts/MobileUnauthorized'

const App = () => {
  const layout = useLayout()

  const [Layout, setLayout] = useState(<div />)

  useEffect(() => {
    const LayoutSelector = () => {
      if (layout.view === 'web') {
        return layout.auth ? <WebAuthorized /> : <WebUnauthorized />
      }
      return layout.auth ? <MobileAuthorized /> : <MobileUnauthorized />
    }
    setLayout(<LayoutSelector />)
  }, [layout])

  return Layout
}

export default withRouter(App)
