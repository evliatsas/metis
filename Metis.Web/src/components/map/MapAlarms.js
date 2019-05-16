import React, { useRef, useState } from 'react'
import { Icon as AntdIcon } from 'antd'
import MapAlarm from './MapAlarm'
import './map.css'

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
    <div className="map-alarms-container" ref={containerRef}>
      <div className="map-alarms-content">
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
