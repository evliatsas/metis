import React from 'react'
import { Tag as AntdTag } from 'antd'

const MapSiteListFilter = ({ filter, onFilterChange }) => {
  function handleClick(evt, value) {
    onFilterChange({ ...value, enabled: !value.enabled })
  }

  return (
    <div style={{ padding: '5px' }}>
      {filter.map(item => (
        <AntdTag
          key={item.key}
          color={item.enabled ? item.color : '#3b3b3b'}
          onClick={evt => handleClick(evt, item)}
          style={{ margin: '5px' }}>
          {item.key}
        </AntdTag>
      ))}
    </div>
  )
}

export default MapSiteListFilter
