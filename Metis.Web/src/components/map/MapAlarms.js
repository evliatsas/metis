import React from 'react'
import classes from './Map.module.sass'
import { statusColor } from './mapBuilder'
const MapAlarms = props => {
  return (
    <div className={classes.AlarmsContainer}>
      <div className={classes.AlarmsContent}>
        {props.alarms.map((alarm, idx) => (
          <p key={idx} style={{ fontSize: 12 }}>
            {alarm.message}{' '}
            <span style={{ color: statusColor[alarm.lastStatus] }}>
              {alarm.lastStatus}{' '}
            </span>
            to{' '}
            <span style={{ color: statusColor[alarm.newStatus] }}>
              {' '}
              {alarm.newStatus}
            </span>
          </p>
        ))}
      </div>
    </div>
  )
}

export default MapAlarms
