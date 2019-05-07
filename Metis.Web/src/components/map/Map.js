import React, { useEffect, useState, useContext } from 'react'
import { Row as AntdRow, Col as AntdCol } from 'antd'
import { buildMap } from './mapBuilder'
import MapAlarms from './MapAlarms'
import MapSiteList from './MapSiteList'
import MapSiteDetails from './MapSiteDetails'
import { GuardHubContext } from '../../websockets/GuardHubProvider'
import api from '../../services/api'

const Map = () => {
  const guard = useContext(GuardHubContext)
  const [sites, setSites] = useState([])
  const [selected, setSelected] = useState(null)
  const [alarms, setAlarms] = useState([])

  useEffect(() => {
    api.get('/api/sites').then(res => {
      const filtered = res.filter(x => x.latitude !== 0)
      buildMap(filtered, id => setSelected(filtered.find(s => s.id === id)))
      setSites(res)
    })
  }, [])

  useEffect(() => {
    if (!guard || !guard.isConnected) {
      return
    }
    guard.connection.on('SiteStatusChanged', message => {
      setAlarms(alarms => [message, ...alarms.slice(-100)])
    })

    guard.connection.on('SiteGuardingException', message => {
      console.log(message)
    })

    return () => {
      if (guard && guard.connection) {
        guard.connection.off('SiteStatusChanged')
        guard.connection.off('SiteGuardingException')
        guard.connection.stop()
      }
    }
  }, [guard])

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
