import React from 'react'
import MapContainer from '../containers/MapContainer'
import Map from './Map'
import MapSiteList from './MapSiteList'
import MapSiteDetails from './MapSiteDetails'
import MapAlarms from './MapAlarms'

const WebMapLayoutView = ({
  sites,
  selected,
  setSelected,
  messages,
  onMaintenanceStart,
  onMaintenanceStop,
  filtered,
  filter,
  filterText,
  setFilterText,
  onFilterChange,
  role
}) => {
  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ flexGrow: 1 }}>
        <Map
          sites={filtered}
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
          width: '300px',
          height: '100vh',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        }}>
        <MapSiteList
          sites={sites}
          onSelect={setSelected}
          filtered={filtered}
          filter={filter}
          filterText={filterText}
          setFilterText={setFilterText}
          onFilterChange={onFilterChange}
        />
        {selected && (
          <MapSiteDetails
            site={selected}
            onClose={() => setSelected(null)}
            onMaintenanceStart={onMaintenanceStart}
            onMaintenanceStop={onMaintenanceStop}
            role={role}
            style={{ minHeight: '100px' }}
          />
        )}
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
