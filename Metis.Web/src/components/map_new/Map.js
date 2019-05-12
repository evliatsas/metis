import React from 'react'
import {
  Map as LeafletMap,
  TileLayer as LeafletTileLayer,
  Marker as LeafletMarker,
  Popup as LeafletPopup
} from 'react-leaflet'

const MAP_CENTER = {
  lat: 38.0,
  lng: 25.0
}

const Map = ({ sites }) => {
  return (
    <LeafletMap center={MAP_CENTER} zoom={7} style={{ height: '100%' }}>
      <LeafletTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </LeafletMap>
  )
}

export default Map
