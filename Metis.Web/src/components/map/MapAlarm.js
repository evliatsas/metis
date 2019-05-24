import React from 'react'
import { statusColor } from './mapUtilities'

const MapAlarm = ({ alarm, isExpanded }) => {
  return (
    <p style={{ fontSize: 12, fontWeight: 'bolder' }}>
      <span style={{ color: statusColor[alarm.currentStatus] }}>
        [{alarm.timestamp.toLocaleTimeString('el-GR')}]
      </span>
      <span style={{ color: 'white' }}>{alarm.name}</span>
      <span style={{ color: statusColor[alarm.previousStatus] }}>
        {alarm.previousStatus}
      </span>
      <span style={{ color: 'white' }}>&rarr;</span>
      <span style={{ color: statusColor[alarm.currentStatus] }}>
        {alarm.currentStatus}
      </span>
      {isExpanded && <span>({alarm.message})</span>}
    </p>
  )
}

export default MapAlarm
