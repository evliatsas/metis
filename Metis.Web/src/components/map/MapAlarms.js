import React from 'react'
import { Icon as AntdIcon } from 'antd'
import classes from './Map.module.sass'

const MapAlarms = props => {
  return (
    <div className={classes.AlarmsContainer}>
      <div className={classes.AlarmsContent}>
        {props.alarms.map((alarm, idx) => (
          <p key={idx} style={{ fontSize: 12 }}>
            <AntdIcon
              type="code"
              twoToneColor="#2abbbb"
              theme="twoTone"
              className="mr-2"
            />
            {alarm.message} {alarm.lastStatus} to {alarm.newStatus}
          </p>
        ))}
      </div>
    </div>
  )
}

export default MapAlarms
