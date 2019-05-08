import React, { useRef, useState } from 'react'
import { Icon as AntdIcon, Divider as AntdDivider } from 'antd'
import classes from './Map.module.sass'
import { statusColor } from './mapBuilder'

// `${site.name}: ${message.previousStatus} -> ${message.currentStatus}`

const MapAlarm = ({ alarm, isExpanded }) => (
  <p style={{ fontSize: 12, fontWeight: 'bolder' }}>
    <span style={{ color: statusColor[alarm.currentStatus] }}>
      [{new Date().toLocaleTimeString('el-GR')}]
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

const MapAlarms = ({ alarms }) => {
  const containerRef = useRef(null)
  const [isExpanded, setIsExpanded] = useState(false)

  function expand() {
    containerRef.current.style.height = 'calc(100% - 40px)'
    containerRef.current.style.width = '60vw'
    setIsExpanded(true)
  }

  function shrink() {
    containerRef.current.style.height = '200px'
    containerRef.current.style.width = '450px'
    setIsExpanded(false)
  }

  return (
    <div className={classes.AlarmsContainer} ref={containerRef}>
      <div className={classes.AlarmsContent}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {!isExpanded ? (
            <span className="is-link" onClick={expand}>
              <AntdIcon
                type="arrows-alt"
                title="Μεγιστοποίηση"
                style={{ fontWeight: 'bolder' }}
              />
            </span>
          ) : (
            <span className="is-link" onClick={shrink}>
              <AntdIcon
                type="shrink"
                title="Ελαχιστοποίηση"
                style={{ fontWeight: 'bolder' }}
              />
            </span>
          )}
        </div>
        {alarms.map((alarm, idx) => (
          <MapAlarm key={idx} alarm={alarm} isExpanded={isExpanded} />
        ))}
      </div>
    </div>
  )
}

export default MapAlarms
