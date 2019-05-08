import React, { useEffect, useState } from 'react'
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

const Map = ({ sites, onSelect }) => {
  const [map, setMap] = useState(null)
  const [layer, setLayer] = useState(null)

  useEffect(() => {
    if (map) {
      return
    }
    setTimeout(() => {
      const _map = new OLMap({
        target: 'map',
        controls: [],
        view: new OLView({
          center: OLfromLonLat([27.0, 38.0]),
          zoom: 7
        })
      })

      apply(_map, darklayer)

      const _layer = new OLVectorLayer({
        source: new OLVectorSource({ features: [] })
      })
      _map.addLayer(_layer)
      _layer.setZIndex(10)

      if (onSelect) {
        const _select = new Select({ layers: [_layer] })
        _map.addInteraction(_select)

        _select.on('select', evt => {
          const marker = _select.getFeatures().getArray()[0]
          const key = marker && marker.getId()
          onSelect(key)
        })
      }

      setMap(_map)
      setLayer(_layer)
    }, 100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  useEffect(() => {
    if (!layer || !sites) {
      return
    }
    const markers = sites
      .filter(x => x.latitude > 0)
      .map(site => siteToMarker(site))

    layer.setSource(new OLVectorSource({ features: markers }))
    layer.getSource().refresh({ force: true })
    console.log('should have refreshed')
  }, [layer, sites])

  return <div id="map" style={{ height: '100%' }} />
}

export default Map
