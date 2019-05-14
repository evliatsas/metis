import React, { useRef, useState } from 'react'
import { Icon as AntdIcon } from 'antd'
import classes from './Map.module.sass'
import MapAlarm from './MapAlarm'

const MapAlarms = ({ alarms, statusColor }) => {
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
          <MapAlarm
            key={idx}
            alarm={alarm}
            isExpanded={isExpanded}
            statusColor={statusColor}
          />
        ))}
      </div>
    </div>
  )
}

export default MapAlarms
