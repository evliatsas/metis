import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import { Circle as CircleStyle, Fill, Style, Icon } from 'ol/style';
import marker from '../assets/marker2.png';

export const addMarker = (site) => {
    return new Feature({
        type: 'geoMarker',
        set: { id: site.id },
        geometry: new Point(fromLonLat([site.longitude, site.latitude]))
    });
}

export const addMarkers = (sites) => {
    return sites.map(s => {
        return new Feature({
            type: 'geoMarker',
            set: { id: s.id, status: s.status },
            geometry: new Point(fromLonLat([s.longitude, s.latitude])),

        });
    });
}

export const alarm = (features) => {
    if (features.some(x => x.values_.set.status === 'Alarm')) {
        return alarmColor('Alarm');
    }
    if (features.some(x => x.values_.set.status === 'Maintenance')) {
        return alarmColor('Maintenance');
    }
    return alarmColor('Ok');
}
// Currently not Used . This is for the standard openlayer maps theme
export const baseMapLayer = new TileLayer({
    source: new XYZ({ url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png' })
});

export const alarmColor = (status) => {
    switch (status) {
        case 'Alarm':
            return '#f5222d';
        case 'Ok':
            return '#52c41a';
        case 'NotFount':
            return '#1890ff';
        case 'Maintenance':
            return '#faad14';
        default:
            return '#52c41a';
    }
}

export const styles = {
    'geoMarker': new Style({
        image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: 'red' }),
            // stroke: new Stroke({
            //     color: 'white', width: 2
            // })
        })
    }),
    'geoIcon': new Style({
        image: new Icon({
            opacity: 1,
            scale: 1,
            src: marker
        })
    })
};