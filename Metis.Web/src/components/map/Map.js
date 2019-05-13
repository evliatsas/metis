import React from 'react'
import {
  Map as LeafletMap,
  TileLayer as LeafletTileLayer,
  Marker as LeafletMarker
  //Popup as LeafletPopup
} from 'react-leaflet'
import leaflet from 'leaflet'
import './map.css'

const TILE_LAYERS = {
  DARK: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
  LIGHT: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}

const MAP_CENTER = {
  lat: 38.0,
  lng: 25.0
}

const statusClass = {
  Alarm: 'marker-alarm',
  Ok: 'marker-ok',
  NotFound: 'marker-alamr',
  Maintenance: 'marker-maintenance',
  Selected: 'marker-selected'
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
                className:
                  selected && selected.id === site.id
                    ? 'marker-selected'
                    : statusClass[site.status]
              })
            }
            onclick={() => onSelect(site)}
          />
        ))}
    </LeafletMap>
  )
}

export default Map
