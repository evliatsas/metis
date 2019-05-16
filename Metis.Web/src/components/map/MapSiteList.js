import React, { useState, useEffect } from 'react'
import {
  Icon as AntdIcon,
  Input as AntdInput,
  Typography as AntdTypography
} from 'antd'
import MapSiteListFilter from './MapSiteListFilter'
import { FILTER, statusColor, applyFilter } from './mapUtilities'

const MapSiteList = ({ sites, onSelect }) => {
  const [filter, setFilter] = useState([...FILTER])
  const [filterText, setFilterText] = useState('')
  const [filtered, setFiltered] = useState([])

  function handleFilterChange(f) {
    setFilter(prevFilter => {
      const idx = prevFilter.findIndex(x => x.key === f.key)
      prevFilter[idx] = f
      return [...prevFilter]
    })
  }

  useEffect(() => {
    const _filtered = sites.filter(site =>
      applyFilter(site, filter, filterText)
    )
    setFiltered(_filtered)
  }, [sites, filter, filterText])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <MapSiteListFilter filter={filter} onFilterChange={handleFilterChange} />
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
