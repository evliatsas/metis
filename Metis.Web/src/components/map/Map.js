import React from 'react'
import {
  Map as LeafletMap,
  TileLayer as LeafletTileLayer,
  Marker as LeafletMarker
} from 'react-leaflet'
import leaflet from 'leaflet'
import './map.css'
import { MAP_CENTER, TILE_LAYERS } from './mapUtilities'

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
