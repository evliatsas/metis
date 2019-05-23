import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../../services/api'

const SitesContainer = props => {
  const { children, history } = props
  const [sites, setSites] = useState([])

  function onCreate() {
    history.push('/admin/sites/new')
  }

  function onEdit(site) {
    console.log('edit', site)
  }

  function onDelete(site) {
    console.log('delete', site)
  }

  useEffect(() => {
    async function fetchSites() {
      const response = await api.get('/api/admin/sites')
      setSites(response)
    }

    fetchSites()
  }, [])

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      sites,
      onCreate,
      onEdit,
      onDelete
    })
  )
}

export default withRouter(SitesContainer)
