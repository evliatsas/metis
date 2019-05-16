import React from 'react'
import MapContainer from '../containers/MapContainer'
import Map from './Map'
import MapSiteList from './MapSiteList'
import MapSiteDetails from './MapSiteDetails'

const WebMapLayoutView = ({
  sites,
  selected,
  setSelected,
  messages,
  onMaintenanceStart,
  onMaintenanceStop
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
      <div
        style={{
          width: '250px',
          height: '100vh',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        }}>
        <MapSiteList sites={sites} onSelect={setSelected} />
        {selected && (
          <MapSiteDetails
            site={selected}
            onClose={() => setSelected(null)}
            onMaintenanceStart={onMaintenanceStart}
            onMaintenanceStop={onMaintenanceStop}
            style={{ minHeight: '100px' }}
          />
        )}
      </div>
    </div>
  )
}

const WebMapLayout = () => (
  <MapContainer>
    <WebMapLayoutView />
  </MapContainer>
)

export default WebMapLayout