import React from 'react'
import classes from './Map.module.sass'
import { statusColor } from './mapBuilder'

// `${site.name}: ${message.previousStatus} -> ${message.currentStatus}`

const MapAlarm = ({ alarm }) => (
  <p style={{ fontSize: 12, fontWeight: 'bolder' }}>
    <span style={{ color: statusColor[alarm.currentStatus] }}>
      [{new Date().toLocaleTimeString('el-GR')}]
    </span>
    <span style={{ color: 'white' }}>{alarm.message}</span>
    <span style={{ color: statusColor[alarm.previousStatus] }}>
      {alarm.previousStatus}
    </span>
    <span style={{ color: 'white' }}>&rarr;</span>
    <span style={{ color: statusColor[alarm.currentStatus] }}>
      {alarm.currentStatus}
    </span>
  </p>
)

const MapAlarms = ({ alarms }) => {
  return (
    <div className={classes.AlarmsContainer}>
      <div className={classes.AlarmsContent}>
        {alarms.map((alarm, idx) => (
          <MapAlarm key={idx} alarm={alarm} />
        ))}
      </div>
    </div>
  )
}

export default MapAlarms
