export const HUB_URL = `${process.env.REACT_APP_API_URL}/guard`

export const TILE_LAYERS = {
  LIGHT:
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  LIGHT_LABELS: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  DARK: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
  DARK_LABELS: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
}

export const MAP_CENTER = {
  lat: 38.0,
  lng: 25.0
}

export const statusColor = {
  Alarm: '#f5222d',
  Ok: '#52c41a',
  NotFound: '#1890ff',
  Maintenance: '#faad14',
  Selected: 'cyan',
  Pending: 'yellow'
}

export const FILTER = [
  { key: 'Ok', enabled: false, color: statusColor['Ok'] },
  { key: 'Alarm', enabled: true, color: statusColor['Alarm'] },
  { key: 'Maintenance', enabled: true, color: statusColor['Maintenance'] },
  { key: 'NotFound', enabled: false, color: statusColor['NotFound'] },
  { key: 'Δήμοι', enabled: true, color: '#2abbbb' }
]

export function applyFilter(site, filter, filterText) {
  return (
    filter.find(x => x.key === site.status).enabled &&
    filter.find(x => x.key === site.category).enabled &&
    site.name.toLowerCase().match(filterText)
  )
}