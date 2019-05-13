import React, { useState, useEffect, useRef } from 'react'
import { Row as AntdRow, Col as AntdCol } from 'antd'
import hubConnectionBuilder from '../../services/hubConnectionBuilder'

import api from '../../services/api'
import Map from './Map'
import MapAlarms from './MapAlarms'
import MapSiteList from './MapSiteList'
import MapSiteDetails from './MapSiteDetails'

const HUB_URL = `${process.env.REACT_APP_API_URL}/guard`

const statusColor = {
  Alarm: '#f5222d',
  Ok: '#52c41a',
  NotFound: '#1890ff',
  Maintenance: '#faad14',
  Selected: 'cyan'
}

const MapContainer = () => {
  const hub = useRef(null)
  const [sites, setSites] = useState([])
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)

  function getSites() {
    api.get('/api/sites').then(res => setSites(res))
  }

  async function onMaintenanceStart() {
    console.log('starting maintenace for', selected.name)
    await api.get(`/api/sites/${selected.id}/maintenance/start`)
    console.log('maintenance started')
    getSites()
  }

  async function onMaintenanceStop() {
    console.log('stopping maintenace for', selected.name)
    await api.get(`/api/sites/${selected.id}/maintenance/stop`)
    console.log('maintenance stopped')
    getSites()
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
        })

        hub.current.on('SiteGuardingException', message => {
          console.log('unhandled message:', message)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ height: '100%' }}>
      <AntdRow style={{ height: '100%' }}>
        <AntdCol xxl={20} xl={19} lg={18} md={16} style={{ height: '100%' }}>
          <Map
            sites={sites}
            selected={selected}
            onSelect={setSelected}
            zoom={9}
            style={{ height: '100%' }}
          />
        </AntdCol>
        <AntdCol
          xxl={4}
          xl={5}
          lg={6}
          md={8}
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <MapSiteList
            sites={sites}
            onSelect={setSelected}
            statusColor={statusColor}
            style={{ flexGrow: 1 }}
          />
          {selected && (
            <MapSiteDetails
              site={selected}
              statusColor={statusColor}
              onClose={() => setSelected(null)}
              onMaintenanceStart={onMaintenanceStart}
              onMaintenanceStop={onMaintenanceStop}
            />
          )}
        </AntdCol>
      </AntdRow>
      <MapAlarms alarms={messages} statusColor={statusColor} />
    </div>
  )
}

export default MapContainer
