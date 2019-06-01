import React, { useState, useEffect, useRef } from 'react'
import hubConnectionBuilder from '../../services/hubConnectionBuilder'
import { HUB_URL, FILTER, applyFilter } from '../map/mapUtilities'
import { useAuth } from '../../contexts/AuthProvider'
import api from '../../services/api'

const MapContainer = ({ children }) => {
  const hub = useRef(null)
  const auth = useAuth()
  const [sites, setSites] = useState([])
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [alarm, setAlarm] = useState(null)
  const [filter, setFilter] = useState([...FILTER])
  const [filterText, setFilterText] = useState('')
  const [filtered, setFiltered] = useState([])
  const [role, setRole] = useState(null)

  async function onMaintenanceStart() {
    setSelected(ps => ({ ...ps, status: 'Pending' }))
    await api.get(`/api/sites/${selected.id}/maintenance/start`)
  }

  async function onMaintenanceStop() {
    setSelected(ps => ({ ...ps, status: 'Pending' }))
    await api.get(`/api/sites/${selected.id}/maintenance/stop`)
  }

  function onFilterChange(f) {
    setFilter(prevFilter => {
      const idx = prevFilter.findIndex(x => x.key === f.key)
      prevFilter[idx] = f
      return [...prevFilter]
    })
  }

  useEffect(() => {
    const session = auth.getSession()
    setRole(auth.isAuthenticated && session ? session.role : null)
  }, [auth])

  useEffect(() => {
    async function fetchSites() {
      const response = await api.get('/api/sites')
      setSites(response)
    }

    fetchSites()

    hubConnectionBuilder(HUB_URL)
      .then(con => {
        hub.current = con

        hub.current.on('SiteStatusChanged', message => {
          console.info(
            `${message.name}: ${message.previousStatus} -> ${
              message.currentStatus
            }`
          )
          message.timestamp = new Date()
          setMessages(messages => [message, ...messages.slice(-100)])
          setAlarm(message)
        })

        hub.current.on('SiteGuardingException', message => {
          console.info('site exception:', message)
        })
      })
      .catch(err => {
        console.error(err)
        hub.current = null
      })

    return () => {
      if (hub.current) {
        hub.current.stop()
        hub.current = null
      }
    }
  }, [])

  useEffect(() => {
    const _filtered = sites.filter(site =>
      applyFilter(site, filter, filterText)
    )
    setFiltered(_filtered)
  }, [sites, filter, filterText])

  useEffect(() => {
    if (!alarm) {
      return
    }

    setSites(prevSites => {
      const site = prevSites.find(x => x.id === alarm.siteId)
      const idx = prevSites.indexOf(site)
      prevSites.splice(idx, 1, { ...site, status: alarm.currentStatus })
      return prevSites.slice()
    })

    setSelected(prevSelected => {
      if (!prevSelected || prevSelected.id !== alarm.siteId) {
        return prevSelected
      }
      return { ...prevSelected, status: alarm.currentStatus }
    })
  }, [alarm])

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      sites,
      messages,
      alarm,
      selected,
      setSelected,
      onMaintenanceStart,
      onMaintenanceStop,
      filtered,
      filter,
      filterText,
      setFilterText,
      onFilterChange,
      role
    })
  )
}

export default MapContainer
