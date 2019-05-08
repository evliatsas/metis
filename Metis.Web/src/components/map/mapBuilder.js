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

function updateMarkers(map, sites, onSelect) {
  if (!map) {
    return
  }

  let layer = map.getLayers().item(1)

  if (!layer) {
    layer = new OLVectorLayer()
    map.addLayer(layer)
    layer.setZIndex(10)
  }

  const markers = sites.map(site => siteToMarker(site))
  const source = new OLVectorSource({ features: markers })

  layer.setSource(source)

  if (onSelect) {
    addSelectInteraction(map, layer, onSelect)
  }

  setTimeout(() => source.refresh(), 10)
  console.log('updateMarkers()')
}

function setMarkerColor(map, id, color) {
  if (!map) {
    return
  }
  const source = map
    .getLayers()
    .item(1)
    .getSource()
  const marker = source.getFeatureById(id)

  if (marker) {
    marker.getStyle().setImage(
      new OLIcon({
        color: color,
        src: dot
      })
    )

    setTimeout(() => source.refresh(), 10)
  }
}

function addSelectInteraction(map, layer, onSelect) {
  const select = new Select({ layers: [layer] })

  map.addInteraction(select)

  select.on('select', evt => {
    // evt.deselected.forEach(marker =>
    //   marker.getStyle().setImage(
    //     new OLIcon({
    //       color: statusColor[marker.get('status')],
    //       src: dot
    //     })
    //   )
    // )

    // select.getFeatures().forEach(marker =>
    //   marker.getStyle().setImage(
    //     new OLIcon({
    //       color: statusColor['Selected'],
    //       src: dot
    //     })
    //   )
    // )

    if (onSelect) {
      const marker = select.getFeatures().getArray()[0]
      const key = marker && marker.getId()
      onSelect(key)
    }
  })
}

const map = {
  instance: null,
  updateMarkers: (sites, onSelect) =>
    updateMarkers(map.instance, sites, onSelect),
  setMarkerColor: (site, color) =>
    setMarkerColor(map.instance, site.id, color || statusColor[site.status])
}

export const buildMap = () => {
  map.instance = new OLMap({
    target: 'map',
    controls: [],
    view: new OLView({
      center: OLfromLonLat([27.0, 38.0]),
      zoom: 7
    })
  })

  apply(map.instance, darklayer)

  return map
}
