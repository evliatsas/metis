import React from 'react'
import {
  Typography as AntdTypography,
  Icon as AntdIcon,
  Divider as AntdDivider
} from 'antd'
import classes from './Map.module.sass'
import { statusColor } from './mapBuilder'
import api from '../../services/api'

async function startMaintenance(site, callback) {
  console.log('starting maintenace for', site.name)
  await api.get(`/api/sites/${site.id}/maintenance/start`)
  console.log('maintenance started')
}

async function stopMaintenance(site) {
  console.log('stopping maintenace for', site.name)
  await api.get(`/api/sites/${site.id}/maintenance/stop`)
  console.log('maintenance stopped')
}

const StartOrStopMaintenanceButton = ({
  site,
  onMaintenanceStart,
  onMaintenanceStop
}) => {
  if (site.status === 'Maintenance') {
    return (
      <span
        className="is-link"
        onClick={() => stopMaintenance(site, onMaintenanceStop)}>
        <AntdIcon type="play-circle" />
        Stop Maintenance
      </span>
    )
  }
  return (
    <span
      className="is-link"
      onClick={() => startMaintenance(site, onMaintenanceStart)}>
      <AntdIcon type="border" />
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
        {site.name}
        <span className="is-right is-link" onClick={onClose}>
          <AntdIcon type="close" />
        </span>
      </AntdTypography.Title>
      <AntdTypography.Paragraph className={classes.SiteViewParagraph}>
        <span style={{ fontSize: 18 }}>
          <AntdIcon
            type="environment"
            theme="twoTone"
            twoToneColor={statusColor[site.status]}
          />{' '}
          Status {site.status}
        </span>
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
          <span className="is-link">
            <AntdIcon type="redo" /> Restart
          </span>{' '}
          <AntdDivider type="vertical" />
          <StartOrStopMaintenanceButton
            site={site}
            onMaintenanceStart={onMaintenanceStart}
            onMaintenanceStop={onMaintenanceStop}
          />
        </div>
      </AntdTypography.Paragraph>
    </div>
  )
}

export default MapSiteDetails
