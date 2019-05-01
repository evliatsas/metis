import React, { useEffect } from 'react'
import { buildMap } from './mapBuilder'
import { callFetch } from '../../services/HttpService'

const Map = () => {
  useEffect(() => {
    callFetch('sites', 'GET').then(res => {
      const filterSites = res.filter(x => x.latitude !== 0)
      buildMap(filterSites)
    })
  }, [])

  return <div style={{ height: '100%', width: '100%' }} id="map" />
}

export default Map
