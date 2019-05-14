import React, { useState, useEffect } from 'react'
import { Icon as AntdIcon, Input as AntdInput } from 'antd'
import MapSiteListFilter from './MapSiteListFilter'
import classes from './Map.module.sass'
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
    <React.Fragment>
      <MapSiteListFilter filter={filter} onFilterChange={handleFilterChange} />
      <div className={classes.SiteListHeader}>
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
      <div className={classes.StatusContainer}>
        {filtered.map(site => (
          <div
            key={site.id}
            className={classes.SiteRow}
            onClick={() => onSelect(site)}>
            <AntdIcon
              type={
                site.status === 'Alarm' ? 'exclamation-circle' : 'info-circle'
              }
              theme="twoTone"
              twoToneColor={statusColor[site.status]}
            />
            <span className="is-link" style={{ marginLeft: '5px' }}>
              {site.name}
            </span>
          </div>
        ))}
      </div>
    </React.Fragment>
  )
}

export default MapSiteList
