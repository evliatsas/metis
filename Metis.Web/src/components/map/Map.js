import React from 'react'
import {
  Map as LeafletMap,
  TileLayer as LeafletTileLayer,
  Marker as LeafletMarker
} from 'react-leaflet'
import leaflet from 'leaflet'
import './map.css'

const TILE_LAYERS = {
  LIGHT:
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  LIGHT_LABELS: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  DARK: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
  DARK_LABELS: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
}

const MAP_CENTER = {
  lat: 38.0,
  lng: 25.0
}

const Map = ({ sites, selected, onSelect }) => {
  return (
    <LeafletMap center={MAP_CENTER} zoom={7} className="map">
      <LeafletTileLayer url={TILE_LAYERS.LIGHT} />
      {sites
        .filter(x => x.latitude > 0)
        .map(site => (
          <LeafletMarker
            key={site.id}
            position={{ lat: site.latitude, lng: site.longitude }}
            icon={
              new leaflet.DivIcon({
                className: `marker-${site.status.toLowerCase()}${
                  selected && selected.id === site.id ? ' marker-selected' : ''
                }`
              })
            }
            onclick={() => onSelect(site)}
          />
        ))}
    </LeafletMap>
  )
}

export default Map
