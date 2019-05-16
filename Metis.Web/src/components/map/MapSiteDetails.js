import React from 'react'
import {
  Typography as AntdTypography,
  Icon as AntdIcon,
  Tag as AntdTag
} from 'antd'
import { FILTER } from './mapUtilities'

const StartOrStopMaintenanceButton = ({
  site,
  onMaintenanceStart,
  onMaintenanceStop
}) => {
  if (site.status === 'Maintenance') {
    return (
      <span className="is-link" onClick={onMaintenanceStop}>
        <AntdIcon type="stop" style={{ marginRight: '5px' }} />
        Stop Maintenance
      </span>
    )
  }
  return (
    <span className="is-link" onClick={onMaintenanceStart}>
      <AntdIcon type="play-circle" style={{ marginRight: '5px' }} />
      Start Maintenance
    </span>
  )
}

const MapSiteDetails = ({
  site,
  onClose,
  onMaintenanceStart,
  onMaintenanceStop
}) => {
  return (
    <div>
      <AntdTypography.Title level={4}>
        <span style={{ flexGrow: 1 }}>{site.name}</span>
        <span className="is-link" onClick={onClose}>
          <AntdIcon type="close" />
        </span>
      </AntdTypography.Title>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <AntdTag color={FILTER.find(x => x.key === site.category).color}>
          {site.category}
        </AntdTag>
        <AntdTag color={FILTER.find(x => x.key === site.status).color}>
          {site.status}
        </AntdTag>
      </div>
      <AntdTypography.Paragraph>
        <AntdTypography.Text>Σελίδες</AntdTypography.Text>
        <ul>
          {site.pages.map((s, i) => (
            <li key={i}>
              <a target="blank" href={s.uri}>
                {s.uri}
              </a>
            </li>
          ))}
        </ul>
        <div>
          {site.status !== 'Pending' && (
            <StartOrStopMaintenanceButton
              site={site}
              onMaintenanceStart={onMaintenanceStart}
              onMaintenanceStop={onMaintenanceStop}
            />
          )}
        </div>
      </AntdTypography.Paragraph>
    </div>
  )
}

export default MapSiteDetails
