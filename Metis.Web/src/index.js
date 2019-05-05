import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './styles/Index.sass'
import App from './App'
import * as serviceWorker from './serviceWorker'
import AuthProvider from './auth/AuthProvider'
import GuardHubProvider from './websockets/GuardHubProvider'

const Root = (
  <BrowserRouter>
    <AuthProvider>
      <GuardHubProvider>
        <App />
      </GuardHubProvider>
    </AuthProvider>
  </BrowserRouter>
)
ReactDOM.render(Root, document.getElementById('root'))

serviceWorker.unregister()
