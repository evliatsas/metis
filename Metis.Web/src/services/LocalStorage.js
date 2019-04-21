const storage = {
    prefix: process.env.REACT_APP_STORAGE_PREFIX || '',
    get: key => {
      const value = localStorage.getItem(storage.prefix + key)
      return JSON.parse(value)
    },
    set: (key, value) => {
      return localStorage.setItem(storage.prefix + key, JSON.stringify(value))
    },
    remove: key => {
      localStorage.removeItem(storage.prefix + key)
    }
  }
  
  export default storage