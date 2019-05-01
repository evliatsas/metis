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

const statusToColor = status => {
  //return '#ffcd46'
  switch (status) {
    case 'Alarm':
      return '#f5222d'
    case 'Ok':
      return '#52c41a'
    case 'NotFount':
      return '#1890ff'
    case 'Maintenance':
      return '#faad14'
    case 'selected':
      return 'blue'
    default:
      return '#52c41a'
  }
}

const siteToMarker = site => {
  const marker = new OLFeature({
    set: { id: site.id, status: site.status },
    geometry: new OLPoint(OLfromLonLat([site.longitude, site.latitude])),
    color: 'red'
  })
  marker.setStyle(
    new OLStyle({
      image: new OLIcon({
        color: statusToColor(site.status),
        src: dot
      })
    })
  )
  return marker
}

export const buildMap = sites => {
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
          color: statusToColor(marker.get('status')),
          src: dot
        })
      )
    )

    select.getFeatures().forEach(marker =>
      marker.getStyle().setImage(
        new OLIcon({
          color: statusToColor('selected'),
          src: dot
        })
      )
    )
  })
}
