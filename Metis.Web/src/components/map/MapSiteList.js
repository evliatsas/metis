import React from 'react'
import { Icon as AntdIcon, Select as AntdSelect } from 'antd'
import classes from './Map.module.sass'
import { statusColor } from './mapBuilder'

const viewFilter = [
  { id: 0, title: 'ΟΚ' },
  { id: 1, title: 'Maintenance' },
  { id: 2, title: 'Alarm' },
  { id: 3, title: 'NotFound' }
]
const handleChange = value => {
  console.log(`selected ${value}`)
}
const options = viewFilter.map(o => (
  <AntdSelect.Option key={o.id}>{o.title}</AntdSelect.Option>
))

const MapSiteList = ({ sites, onSelect }) => {
  function handleSelect(site) {
    onSelect(site.id)
  }
  return (
    <React.Fragment>
      <div className={classes.DropdownInput}>
        <AntdSelect
          dropdownClassName={classes.Dropdown}
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Επιλέξτε Προβολή"
          onChange={handleChange}
          allowClear={true}>
          {options}
        </AntdSelect>
      </div>
      <div className={classes.StatusContainer}>
        {sites.map(site => (
          <div
            key={site.id}
            className={classes.SiteRow}
            onClick={() => handleSelect(site)}>
            <AntdIcon
              type={
                site.status === 'Alarm' ? 'exclamation-circle' : 'info-circle'
              }
              theme="twoTone"
              twoToneColor={statusColor[site.status]}
            />
            <span className="is-link">{' ' + site.name}</span>
          </div>
        ))}
      </div>
    </React.Fragment>
  )
}

export default MapSiteList
