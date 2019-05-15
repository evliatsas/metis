import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './styles/Index.sass'
import App from './App'
import AuthProvider from './contexts/AuthProvider'
import * as serviceWorker from './serviceWorker'

const Root = (
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)
ReactDOM.render(Root, document.getElementById('root'))

serviceWorker.unregister()
