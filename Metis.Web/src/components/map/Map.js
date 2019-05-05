import React, { useEffect, useState, useContext } from 'react'
import {
  Row as AntdRow,
  Col as AntdCol,
  Icon as AntdIcon,
  Select,
  Typography as AntdTyp,
  Divider
} from 'antd'
import { buildMap, statusColor } from './mapBuilder'
import { callFetch } from '../../services/HttpService'
import classes from './Map.module.sass'
import MapAlarms from './MapAlarms'
import { GuardHubContext } from '../../websockets/GuardHubProvider'
const Option = Select.Option

const viewFilter = [
  { id: 0, title: 'ΟΚ' },
  { id: 1, title: 'Maintenance' },
  { id: 2, title: 'Alarm' },
  { id: 3, title: 'NotFound' }
]
const Map = () => {
  const guard = useContext(GuardHubContext)
  const [sites, setSites] = useState([])
  const [selected, setSelected] = useState(null)
  const handleSelect = id => {
    const site = sites.find(x => x.id === id)
    setSelected(site)
  }
  useEffect(() => {
    callFetch('sites', 'GET').then(res => {
      //const filtered = res.filter(x => x.latitude !== 0)
      // buildMap(filtered, id => setSelected(filtered.find(s => s.id === id)))
      //setSites(res)
    })
  }, [])

  useEffect(() => {
    if (!guard || !guard.isConnected) {
      return
    }
    guard.connection.on('SiteStatusChanged', evt => {
      console.log(evt)
    })

    guard.connection.on('SiteGuardingException', evt => {
      console.log(evt)
    })
  }, [guard])
  const handleChange = value => {
    console.log(`selected ${value}`)
  }
  const options = viewFilter.map(o => <Option key={o.id}>{o.title}</Option>)
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <AntdRow style={{ height: '100%' }}>
        <AntdCol xxl={20} xl={19} lg={18} md={16} style={{ height: '100%' }}>
          <div style={{ height: '100%', width: '100%' }} id="map" />
        </AntdCol>
        <AntdCol xxl={4} xl={5} lg={6} md={8} style={{ height: '100%' }}>
          <div className={classes.DropdownInput}>
            <Select
              dropdownClassName={classes.Dropdown}
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Επιλέξτε Προβολή"
              onChange={handleChange}
              allowClear={true}>
              {options}
            </Select>
          </div>
          <div className={classes.StatusContainer}>
            {sites
              .filter(x => x.status !== 'Ok')
              .map(site => (
                <div
                  key={site.id}
                  className={classes.SiteRow}
                  onClick={() => {
                    handleSelect(site.id)
                  }}>
                  <AntdIcon
                    type={
                      site.status === 'Alarm'
                        ? 'exclamation-circle'
                        : 'info-circle'
                    }
                    theme="twoTone"
                    twoToneColor={statusColor[site.status]}
                  />
                  <span className="is-link">{' ' + site.name}</span>
                </div>
              ))}
          </div>
          {selected && (
            <div className={classes.SiteView}>
              <AntdTyp.Title level={4} className={classes.SiteViewHeader}>
                {selected.name}
                <span
                  className="is-right is-link"
                  onClick={() => setSelected(null)}>
                  <AntdIcon type="close" />
                </span>
              </AntdTyp.Title>
              <AntdTyp.Paragraph className={classes.SiteViewParagraph}>
                <span style={{ fontSize: 18 }}>
                  <AntdIcon
                    type="environment"
                    theme="twoTone"
                    twoToneColor={statusColor[selected.status]}
                  />{' '}
                  Status {selected.status}
                </span>
                <div style={{ marginTop: 10 }}>
                  <AntdTyp.Text>Σελίδες</AntdTyp.Text>
                </div>
                <ul>
                  {selected.pages.map((s, i) => (
                    <li key={i}>
                      <a target="blank" href={s.uri}>
                        {s.uri}
                      </a>
                    </li>
                  ))}
                </ul>
                <p>
                  <span className="is-link">
                    <AntdIcon type="redo" /> Restart
                  </span>{' '}
                  <Divider type="vertical" />
                  <span className="is-link">
                    <AntdIcon type="play-circle" /> Start
                  </span>{' '}
                  <Divider type="vertical" />
                  <span className="is-link">
                    <AntdIcon type="border" /> Stop
                  </span>
                </p>
              </AntdTyp.Paragraph>
            </div>
          )}
        </AntdCol>
      </AntdRow>
      <MapAlarms alarms={[]} />
    </div>
  )
}

export default Map
