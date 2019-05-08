import React, { useEffect, useState, useContext, useRef } from 'react'
import { Row as AntdRow, Col as AntdCol } from 'antd'
import { buildMap, statusColor } from './mapBuilder'
import MapAlarms from './MapAlarms'
import MapSiteList from './MapSiteList'
import MapSiteDetails from './MapSiteDetails'
import { GuardHubContext } from '../../websockets/GuardHubProvider'
import api from '../../services/api'

const Map = () => {
  const guard = useContext(GuardHubContext)
  const [map, setMap] = useState(null)
  const [sites, setSites] = useState([])
  const [selected, setSelected] = useState(null)
  const [alarms, setAlarms] = useState([])

  async function getSites() {
    const res = await api.get('/api/sites')
    setSites(res)
    console.log('sites fetched')
    return res
  }

  useEffect(() => {
    setTimeout(() => setMap(buildMap()), 0)
  }, [])

  useEffect(() => {
    if (!map) {
      return
    }
    getSites()
  }, [map])

  useEffect(() => {
    if (sites.length > 0 && map) {
      map.updateMarkers(sites, id => setSelected(sites.find(x => x.id === id)))
    }
  }, [map, sites])

  useEffect(() => {
    if (!guard || !guard.isConnected) {
      return
    }
    guard.connection.on('SiteStatusChanged', message => {
      const site = sites.find(x => x.id === message.id)
      if (site) {
        console.log(
          `${site.name}: ${message.previousStatus} -> ${message.currentStatus}`
        )
        site.status = message.currentStatus
        map.setMarkerColor(site, statusColor[message.currentStatus])
      }
      setAlarms(alarms => [message, ...alarms.slice(-100)])
    })

    guard.connection.on('SiteGuardingException', message => {
      console.log(message)
    })

    return () => {
      if (guard && guard.connection) {
        guard.connection.off('SiteStatusChanged')
        guard.connection.off('SiteGuardingException')
      }
    }
  }, [map, guard, sites])

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <AntdRow style={{ height: '100%' }}>
        <AntdCol xxl={20} xl={19} lg={18} md={16} style={{ height: '100%' }}>
          <div style={{ height: '100%', width: '100%' }} id="map" />
        </AntdCol>
        <AntdCol xxl={4} xl={5} lg={6} md={8} style={{ height: '100%' }}>
          <MapSiteList sites={sites} onSelect={setSelected} />
          {selected && (
            <MapSiteDetails site={selected} onClose={() => setSelected(null)} />
          )}
        </AntdCol>
      </AntdRow>
      <MapAlarms alarms={alarms} />
    </div>
  )
}

export default Map
