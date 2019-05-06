import React from 'react'
import classes from './Map.module.sass'
import { statusColor } from './mapBuilder'

const MapAlarms = ({ alarms }) => {
  return (
    <div className={classes.AlarmsContainer}>
      <div className={classes.AlarmsContent}>
        {alarms.map((alarm, idx) => (
          <p key={idx} style={{ fontSize: 12 }}>
            <span style={{ color: 'white' }}>
              [{new Date().toLocaleTimeString('el-GR')}]
            </span>{' '}
            {alarm.message}{' '}
            <span style={{ color: statusColor[alarm.previousStatus] }}>
              {alarm.previousStatus}{' '}
            </span>
            to{' '}
            <span style={{ color: statusColor[alarm.currentStatus] }}>
              {' '}
              {alarm.currentStatus}
            </span>
          </p>
        ))}
      </div>
    </div>
  )
}

export default MapAlarms
