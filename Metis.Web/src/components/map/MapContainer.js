import React, { useState, useEffect, useRef } from 'react'
import { Row as AntdRow, Col as AntdCol } from 'antd'
import hubConnectionBuilder from '../../services/hubConnectionBuilder'
import { HUB_URL } from './mapUtilities'
import api from '../../services/api'
import Map from './Map'
import MapAlarms from './MapAlarms'
import MapSiteList from './MapSiteList'
import MapSiteDetails from './MapSiteDetails'

const MapContainer = () => {
  const hub = useRef(null)
  const [sites, setSites] = useState([])
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [alarm, setAlarm] = useState(null)

  function getSites() {
    api.get('/api/sites').then(res => setSites(res))
  }

  async function onMaintenanceStart() {
    setSelected(ps => ({ ...ps, status: 'Pending' }))
    await api.get(`/api/sites/${selected.id}/maintenance/start`)
  }

  async function onMaintenanceStop() {
    setSelected(ps => ({ ...ps, status: 'Pending' }))
    await api.get(`/api/sites/${selected.id}/maintenance/stop`)
  }

  useEffect(() => {
    getSites()

    hubConnectionBuilder(HUB_URL)
      .then(con => {
        hub.current = con

        hub.current.on('SiteStatusChanged', message => {
          console.info(
            `${message.name}: ${message.previousStatus} -> ${
              message.currentStatus
            }`
          )
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
    if (!alarm) {
      return
    }

    setSites(prevSites => {
      const site = prevSites.find(x => x.id === alarm.id)
      const idx = prevSites.indexOf(site)
      prevSites.splice(idx, 1, { ...site, status: alarm.currentStatus })
      return prevSites.slice()
    })

    setSelected(prevSelected => {
      if (!prevSelected || prevSelected.id !== alarm.id) {
        return prevSelected
      }
      return { ...prevSelected, status: alarm.currentStatus }
    })
  }, [alarm])

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ flexGrow: 1 }}>
        <Map
          sites={sites}
          selected={selected}
          onSelect={setSelected}
          zoom={9}
          style={{ height: '100vh' }}
        />
        <svg hidden>
          <filter id="map-filter">
            <feColorMatrix
              type="matrix"
              values="0.2 0 0 0 0
                    0 0.3 0 0 0
                    0 0 0.4 0 0
                    0 0 0 1 0"
            />
          </filter>
        </svg>
      </div>
      <div style={{ width: '250px', height: '100vh' }}>
        <MapSiteList
          sites={sites}
          onSelect={setSelected}
          style={{ flexGrow: 1 }}
        />
      </div>
      <MapAlarms alarms={messages} />
    </div>
  )
}

export default MapContainer
