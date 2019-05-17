import React, { useState, useContext } from 'react'
import jwt from 'jsonwebtoken'
import storage from '../services/storage'

const tokenSuffix = 'token'
const sessionSuffix = 'auth'

const AuthContext = React.createContext(null)

const AuthProvider = props => {
  const token = storage.get(tokenSuffix)
  let session = storage.get(sessionSuffix)
  const getSession = () => {
    if (!session && token) {
      session = jwt.decode(token)
      storage.set(sessionSuffix, session)
    }
    return session
  }
  const isExpired = () => {
    const session = getSession()
    const expired = session && session.exp * 1000 < new Date().valueOf()
    return expired
  }
  const initAuthentication = () => {
    session = getSession()
    const check = session && session.username && !isExpired()
    return check
  }
  const signIn = token => {
    const session = jwt.decode(token)
    storage.set(tokenSuffix, token)
    storage.set(sessionSuffix, session)
    setIsAuthenticated(true)
  }
  const signOut = () => {
    storage.remove(tokenSuffix)
    storage.remove(sessionSuffix)
    setIsAuthenticated(false)
  }
  const [isAuthenticated, setIsAuthenticated] = useState(initAuthentication())

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
