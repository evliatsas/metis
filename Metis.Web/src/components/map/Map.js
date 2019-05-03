import React, { useEffect, useState } from 'react'
import { Row as AntdRow, Col as AntdCol, Icon as AntdIcon } from 'antd'
import { buildMap, statusColor } from './mapBuilder'
import { callFetch } from '../../services/HttpService'

const Map = () => {
  const [sites, setSites] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    callFetch('sites', 'GET').then(res => {
      const filtered = res.filter(x => x.latitude !== 0)
      buildMap(filtered, id => setSelected(filtered.find(s => s.id === id)))
      setSites(res)
    })
  }, [])

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <AntdRow style={{ height: '100%' }}>
        <AntdCol span={18} style={{ height: '100%' }}>
          <div style={{ height: '100%', width: '100%' }} id="map" />
        </AntdCol>
        <AntdCol span={6} style={{ height: '100%' }}>
          <div
            style={{
              maxHeight: '60%',
              overflowY: 'scroll',
              scrollbarWidth: '0px',
              scrollbarColor: 'black'
            }}>
            {sites
              .filter(x => x.status !== 'Ok')
              .map(site => (
                <div key={site.id}>
                  <AntdIcon
                    type={
                      site.status === 'Alarm'
                        ? 'exclamation-circle'
                        : 'info-circle'
                    }
                    theme="twoTone"
                    twoToneColor={statusColor[site.status]}
                  />
                  <span>{' ' + site.name}</span>
                </div>
              ))}
          </div>
          {selected && <div>{JSON.stringify(selected)}</div>}
        </AntdCol>
      </AntdRow>
    </div>
  )
}

export default Map
