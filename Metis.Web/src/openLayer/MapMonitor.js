import React, { useState, useEffect } from 'react'
import Map from '../../openLayer/MapLayer'
import MapDrawer from './MapDrawer'
import { callFetch } from '../../services/HttpService'
import { Icon, List, Badge } from 'antd'

const MapMonitor = () => {
  // const [sidedrawer, setSiderdrawer] = useState(false);
  const [sites, setSites] = useState([])
  const [selected, setSelected] = useState(null)
  const status = [
    { label: 'Ok', status: 'success' },
    { label: 'Alarm', status: 'error' },
    { label: 'Maintenance', status: 'warning' },
    { label: 'NotFound', status: 'processing' }
  ]

  const drawerHandler = id => {
    const s = sites.find(x => x.id === id)
    if (s) {
      setSelected(s)
    }
  }

  const getStatusCount = s => {
    return sites.filter(x => x.status === s).length
  }

  const clearSelected = () => {
    setSelected()
  }

  useEffect(() => {
    callFetch('sites', 'GET').then(res => {
      const filterSites = res.filter(x => x.latitude !== 0)
      console.log(filterSites)
      setSites(filterSites)
    })
  }, [])

  return (
    <React.Fragment>
      <Map
        height={'100%'}
        width={'100%'}
        sites={sites}
        selectSite={id => drawerHandler(id)}
      />
      <MapDrawer selected={selected} close={clearSelected} />
      <List
        className="list-map"
        size="small"
        header={
          <div className="has-text-primary">
            <Icon type="bell" theme="twoTone" twoToneColor="#2abdbd" />{' '}
            Κατάσταση
          </div>
        }
        bordered
        dataSource={status}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              description={
                <div className="mr-2">
                  <Badge status={item.status} /> {item.label}
                </div>
              }
            />
            <div>{getStatusCount(item.label)}</div>
          </List.Item>
        )}
      />
    </React.Fragment>
  )
}

export default MapMonitor
