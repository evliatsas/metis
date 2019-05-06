import React from 'react'
import {
  Typography as AntdTypography,
  Icon as AntdIcon,
  Divider as AntdDivider
} from 'antd'
import classes from './Map.sass'
import { statusColor } from './mapBuilder'
import api from '../../services/api'

async function startOrStopMaintenance(site) {
  return await api.get({
    url: `/api/sites/${site.id}/maintenance/${
      site.status === 'Maintenance' ? 'stop' : 'start'
    }`
  })
}

const StartOrStopMaintenanceButton = ({ site }) => {
  if (site.status === 'Maintenance') {
    return (
      <span className="is-link" onClick={() => startOrStopMaintenance(site)}>
        <AntdIcon type="play-circle" />
        Stop Maintenance
      </span>
    )
  }
  return (
    <span className="is-link" onClick={() => startOrStopMaintenance(site)}>
      <AntdIcon type="border" />
      Start Maintenance
    </span>
  )
}

const MapSiteDetails = ({ site, onClose }) => {
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
          <StartOrStopMaintenanceButton site={site} />
          {/* <span className="is-link">
            <AntdIcon type="play-circle" /> Start
          </span>{' '}
          <AntdDivider type="vertical" />
          <span className="is-link">
            <AntdIcon type="border" /> Stop
          </span> */}
        </div>
      </AntdTypography.Paragraph>
    </div>
  )
}

export default MapSiteDetails
