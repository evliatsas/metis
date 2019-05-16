import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AuthProvider from './contexts/AuthProvider'
import * as serviceWorker from './serviceWorker'
import './styles/index.css'

const Root = (
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)
ReactDOM.render(Root, document.getElementById('root'))

serviceWorker.unregister()
