import React from 'react'
import MapContainer from '../containers/MapContainer'
import Map from './Map'
import MapAlarms from './MapAlarms'

const WebMapLayoutView = ({
  sites,
  selected,
  setSelected,
  messages
  //onMaintenanceStart,
  //onMaintenanceStop
}) => {
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
              values="0.2 0 0 0 0  0 0.3 0 0 0  0 0 0.4 0 0  0 0 0 1 0"
            />
          </filter>
        </svg>
      </div>
      <MapAlarms alarms={messages} />
    </div>
  )
}

const WebMapLayout = () => (
  <MapContainer>
    <WebMapLayoutView />
  </MapContainer>
)

export default WebMapLayout
