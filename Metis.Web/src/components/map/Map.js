import React, { useRef, useEffect, useState } from 'react'
import { Map as OLMap, View as OLView, Feature as OLFeature } from 'ol'
import { Vector as OLVectorSource } from 'ol/source'
import { Vector as OLVectorLayer } from 'ol/layer'
import { fromLonLat as OLfromLonLat } from 'ol/proj'
import { Style as OLStyle, Icon as OLIcon } from 'ol/style'
import { Point as OLPoint } from 'ol/geom'
import Select from 'ol/interaction/Select'
import { apply } from 'ol-mapbox-style'
import darklayer from './darklayer.json'
import dot from '../../assets/dot.png'

const statusColor = {
  Alarm: '#f5222d',
  Ok: '#52c41a',
  NotFound: '#1890ff',
  Maintenance: '#faad14',
  Selected: 'cyan'
}

function siteToMarker(site) {
  const marker = new OLFeature({
    geometry: new OLPoint(OLfromLonLat([site.longitude, site.latitude])),
    label: site.name
  })
  marker.setId(site.id)
  marker.set('status', site.status)
  marker.setStyle(
    new OLStyle({
      image: new OLIcon({
        color: statusColor[site.status],
        src: dot
      })
    })
  )
  return marker
}

const Map = ({ sites }) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [layer, setLayer] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      const _map = new OLMap({
        target: mapRef.current,
        controls: [],
        view: new OLView({
          center: OLfromLonLat([27.0, 38.0]),
          zoom: 7
        })
      })

      apply(_map, darklayer)

      const vectorLayer = new OLVectorLayer({
        source: new OLVectorSource({ features: [] })
      })
      _map.addLayer(vectorLayer)
      vectorLayer.setZIndex(10)
      setMap(_map)
      setLayer(vectorLayer)
    }, 0)
  }, [])

  useEffect(() => {
    if (!layer || !sites) {
      return
    }
    const markers = sites.map(site => siteToMarker(site))

    layer.setSource(new OLVectorSource({ features: markers }))
    layer.getSource().refresh({ force: true })
    console.log('should have refreshed')
  }, [layer, sites])

  return <div id="map" ref={mapRef} style={{ height: '100%' }} />
}

export default Map
