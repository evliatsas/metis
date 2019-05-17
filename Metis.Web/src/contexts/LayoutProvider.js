import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'

const BREAKPOINT = 800

const LayoutContext = createContext(null)

const LayoutProvider = ({ children }) => {
  const auth = useAuth()
  const [layout, setLayout] = useState({
    view: window.innerWidth > BREAKPOINT ? 'web' : 'mobile',
    auth: auth.isAuthenticated
  })

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= BREAKPOINT && layout.view !== 'mobile') {
        setLayout(prevLayout => ({ ...prevLayout, view: 'mobile' }))
      }
      if (window.innerWidth > BREAKPOINT && layout.view !== 'web') {
        setLayout(prevLayout => ({ ...prevLayout, view: 'web' }))
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [layout])

  useEffect(() => {
    setLayout(prevLayout => ({ ...prevLayout, auth: auth.isAuthenticated }))
  }, [auth.isAuthenticated])

  return (
    <LayoutContext.Provider value={layout}>{children}</LayoutContext.Provider>
  )
}

export const useLayout = () => useContext(LayoutContext)

export default LayoutProvider
