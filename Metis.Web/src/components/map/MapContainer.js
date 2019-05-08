import React, { useState, useEffect, useRef } from 'react'
import { Row as AntdRow, Col as AntdCol } from 'antd'
import hubConnectionBuilder from '../../services/hubConnectionBuilder'

import api from '../../services/api'
import Map from './Map'
import MapAlarms from './MapAlarms'
import MapSiteList from './MapSiteList'
import MapSiteDetails from './MapSiteDetails'

const HUB_URL = `${process.env.REACT_APP_API_URL}/guard`

const MapContainer = () => {
  const hub = useRef(null)
  const [sites, setSites] = useState([])
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [selectedSite, setSelectedSite] = useState(null)

  useEffect(() => {
    api.get('/api/sites').then(res => setSites(res))

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
        console.log('cleanup')
        hub.current.stop()
        hub.current = null
        console.log('connection to guard hub closed')
      }
    }
  }, [])

  useEffect(() => {
    setSelectedSite(selected ? sites.find(x => x.id === selected) : null)
  }, [sites, selected])

  return (
    <div style={{ height: '100%' }}>
      <AntdRow style={{ height: '100%' }}>
        <AntdCol xxl={20} xl={19} lg={18} md={16} style={{ height: '100%' }}>
          <Map sites={sites} onSelect={setSelected} />
        </AntdCol>
        <AntdCol xxl={4} xl={5} lg={6} md={8} style={{ height: '100%' }}>
          <MapSiteList sites={sites} onSelect={setSelected} />
          {selectedSite && (
            <MapSiteDetails
              site={selectedSite}
              onClose={() => setSelected(null)}
            />
          )}
        </AntdCol>
      </AntdRow>
      <MapAlarms alarms={messages} />
    </div>
  )
}

export default MapContainer
