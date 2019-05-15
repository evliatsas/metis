import React, { createContext, useContext, useState, useEffect } from 'react'

const WindowSizeContext = createContext(null)

const WindowSizeProvider = ({ children }) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <WindowSizeContext.Provider value={dimensions}>
      {children}
    </WindowSizeContext.Provider>
  )
}

export default WindowSizeProvider

export const useWindowSize = () => useContext(WindowSizeContext)
