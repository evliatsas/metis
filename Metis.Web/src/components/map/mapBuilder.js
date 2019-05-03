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

export const statusColor = {
  Alarm: '#f5222d',
  Ok: '#52c41a',
  NotFound: '#1890ff',
  Maintenance: '#faad14',
  Selected: 'cyan'
}

const siteToMarker = site => {
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

export const buildMap = (sites, onSelect) => {
  const map = new OLMap({
    target: 'map',
    controls: [],
    view: new OLView({
      center: OLfromLonLat([27.0, 38.0]),
      zoom: 7
    })
  })

  apply(map, darklayer)

  const markers = sites.map(site => siteToMarker(site))
  const vectorSource = new OLVectorSource({ features: markers })
  const markerVectorLayer = new OLVectorLayer({ source: vectorSource })

  map.addLayer(markerVectorLayer)

  markerVectorLayer.setZIndex(10)

  const select = new Select({ layers: [markerVectorLayer] })

  map.addInteraction(select)

  select.on('select', evt => {
    evt.deselected.forEach(marker =>
      marker.getStyle().setImage(
        new OLIcon({
          color: statusColor[marker.get('status')],
          src: dot
        })
      )
    )

    select.getFeatures().forEach(marker =>
      marker.getStyle().setImage(
        new OLIcon({
          color: statusColor['Selected'],
          src: dot
        })
      )
    )

    if (onSelect) {
      const marker = select.getFeatures().getArray()[0]
      const key = marker && marker.getId()
      onSelect(key)
    }
  })
}
