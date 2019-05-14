import React from 'react'
import {
  Typography as AntdTypography,
  Icon as AntdIcon,
  Tag as AntdTag
} from 'antd'
import classes from './Map.module.sass'
import { FILTER, statusColor } from './mapUtilities'

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
    <div className={classes.SiteView}>
      <AntdTypography.Title level={4} className={classes.SiteViewHeader}>
        <span style={{ flexGrow: 1 }}>{site.name}</span>
        <span className="is-link" onClick={onClose}>
          <AntdIcon type="close" />
        </span>
      </AntdTypography.Title>
      <div style={{ padding: '10px' }}>
        <AntdTag color={FILTER.find(x => x.key === site.category).color}>
          {site.category}
        </AntdTag>
        <AntdTag color={FILTER.find(x => x.key === site.status).color}>
          {site.status}
        </AntdTag>
      </div>
      <AntdTypography.Paragraph className={classes.SiteViewParagraph}>
        {/* <span style={{ fontSize: 18 }}>
          <AntdIcon
            type="environment"
            theme="twoTone"
            twoToneColor={statusColor[site.status]}
          />{' '}
          Status {site.status}
        </span> */}
        <div style={{ marginTop: 10 }}>
          <AntdTypography.Text>Σελίδες</AntdTypography.Text>
        </div>
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
