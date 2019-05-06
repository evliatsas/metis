import React from 'react'
import {
  Typography as AntdTypography,
  Icon as AntdIcon,
  Divider as AntdDivider
} from 'antd'
import classes from './Map.module.sass'
import { statusColor } from './mapBuilder'

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
          <span className="is-link">
            <AntdIcon type="play-circle" /> Start
          </span>{' '}
          <AntdDivider type="vertical" />
          <span className="is-link">
            <AntdIcon type="border" /> Stop
          </span>
        </div>
      </AntdTypography.Paragraph>
    </div>
  )
}

export default MapSiteDetails
