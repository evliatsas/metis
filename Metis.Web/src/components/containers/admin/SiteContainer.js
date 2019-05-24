import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../../services/api'

const initialState = {
  name: 'Νέος Ιστότοπος',
  category: 'Δήμοι',
  encodingCode: 'ISO-8859-7',
  pages: [],
  emailAddressess: [],
  status: 0
}

const SiteContainer = props => {
  const { id } = props.match.params
  const { children, history } = props
  const [site, setSite] = useState(initialState)

  async function onSave() {
    if (site.id) {
      await api.put(`/api/admin/sites/${id}`, site)
      history.push('/admin/sites')
    } else {
      await api.post(`/api/admin/sites`, site)  
      history.push('/admin/sites')   
    }

    onBack()
  }

  function onBack() {
    history.push('/admin/sites')
  }

  function onCancel() {
    onBack()
  }

  async function onDelete() {
    await api.delete(`/api/admin/sites/${id}`)
    history.push('/admin/sites')
  }

  const siteHandler = newValue => {
    setSite({ ...newValue })
  }


  useEffect(() => {
    async function fetchSite() {
      if (id === 'new') {
        return
      }
      const response = await api.get(`/api/admin/sites/${id}`)
      setSite(response)
    }

    fetchSite()
  }, [id])

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      site,
      onBack,
      onCancel,
      onSave,
      onDelete,
      siteHandler
    })
  )
}

export default withRouter(SiteContainer)
