import React from 'react'
import {
  Icon as AntdIcon,
  Input as AntdInput,
  Typography as AntdTypography
} from 'antd'
import MapSiteListFilter from './MapSiteListFilter'
import { statusColor } from './mapUtilities'

const MapSiteList = ({
  sites,
  onSelect,
  filtered,
  filter,
  filterText,
  setFilterText,
  onFilterChange
}) => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <MapSiteListFilter filter={filter} onFilterChange={onFilterChange} />
      <div className="map-site-list-header">
        <div style={{ flexGrow: 1, padding: '6px' }}>
          <AntdInput
            prefix={<AntdIcon type="search" />}
            value={filterText}
            onChange={evt => setFilterText(evt.target.value.toLowerCase())}
          />
        </div>
        <div
          style={{
            padding: '6px',
            display: 'flex',
            alignItems: 'center'
          }}>
          ({filtered.length}/{sites.length})
        </div>
      </div>
      <div className="map-site-list">
        {filtered.map(site => (
          <div
            key={site.id}
            onClick={() => onSelect(site)}
            style={{ padding: '2px' }}>
            <AntdIcon
              type={
                site.status === 'Alarm' ? 'exclamation-circle' : 'info-circle'
              }
              theme="twoTone"
              twoToneColor={statusColor[site.status]}
            />
            <AntdTypography.Text className="map-site-list-item">
              {site.name}
            </AntdTypography.Text>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MapSiteList
