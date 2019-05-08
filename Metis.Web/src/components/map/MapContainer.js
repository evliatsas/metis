import React, { useState, useEffect, useContext } from 'react'
import { Row as AntdRow, Col as AntdCol } from 'antd'
import { GuardHubContext } from '../../websockets/GuardHubProvider'
import api from '../../services/api'
import Map from './Map'
import MapAlarms from './MapAlarms'
import MapSiteList from './MapSiteList'
import MapSiteDetails from './MapSiteDetails'

const MapContainer = () => {
  const guard = useContext(GuardHubContext)
  const [sites, setSites] = useState([])
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)

  async function getSites() {
    const res = await api.get('/api/sites')
    setSites(res)
  }

  const onSelectCb = id => {
    console.log(id, sites)
  }

  useEffect(() => {
    getSites()
  }, [])

  useEffect(() => {
    if (!guard || !guard.isConnected) {
      return
    }

    guard.connection.on('SiteStatusChanged', message => {
      const site = sites.find(x => x.id === message.id)
      if (site) {
        console.info(
          `${site.name}: ${message.previousStatus} -> ${message.currentStatus}`
        )
        site.status = message.currentStatus
        //map.setMarkerColor(site, statusColor[message.currentStatus])
      }
      setMessages(messages => [message, ...messages.slice(-100)])
    })

    guard.connection.on('SiteGuardingException', message => {
      console.log('unhandled message:', message)
    })

    return () => {
      if (guard && guard.connection) {
        guard.connection.off('SiteStatusChanged')
        guard.connection.off('SiteGuardingException')
      }
    }
  }, [guard, sites])

  return (
    <div style={{ height: '100%' }}>
      <AntdRow style={{ height: '100%' }}>
        <AntdCol xxl={20} xl={19} lg={18} md={16} style={{ height: '100%' }}>
          <Map sites={sites} onSelect={id => onSelectCb(id)} />
        </AntdCol>
        <AntdCol xxl={4} xl={5} lg={6} md={8} style={{ height: '100%' }}>
          <MapSiteList sites={sites} onSelect={setSelected} />
          {selected && (
            <MapSiteDetails site={selected} onClose={() => setSelected(null)} />
          )}
        </AntdCol>
      </AntdRow>
      <MapAlarms alarms={messages} />
    </div>
  )
}

export default MapContainer
