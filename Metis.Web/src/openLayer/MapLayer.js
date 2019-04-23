import React, { useEffect } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { Point } from 'ol/geom';
// import VectorTile from 'ol/VectorTile'
// import { fromLonLat } from 'ol/proj';
// import Overlay from 'ol/Overlay';
// import Polyline from 'ol/format/Polyline';
// import BingMaps from 'ol/source/BingMaps';
import { transform } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import Vector from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from 'ol/style';
import 'ol/ol.css';
const MapLayer = props => {
    const layer = new TileLayer({
        source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        })
    });
    const styles = {
        'icon': new Style({
            image: new Icon({
                anchor: [0.5, 1],
                src: 'data/icon.png'
            })
        }),
        'geoMarker': new Style({
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({ color: 'red' }),
                stroke: new Stroke({
                    color: 'white', width: 2
                })
            })
        })
    };
    const geoMarker = new Feature({
        type: 'geoMarker',
        geometry: new Point(transform([23.727539, 37.983810], 'EPSG:4326', 'EPSG:3857'))
        //  transform([23.727539, 37.983810], 'EPSG:4326', 'EPSG:3857');
        // fromLonLat([16.3725, 48.208889])
    });

    var vectorLayer = new Vector({
        source: new VectorSource({
            features: [geoMarker]
        }),
        style: function (feature) {
            // hide geoMarker if animation is active           
            return styles[feature.get('type')];
        }
    });
    useEffect(() => {
        const center = transform([23.727539, 37.983810], 'EPSG:4326', 'EPSG:3857');
        setTimeout(() => {
            const map = new Map({
                target: 'genericmap',
                layers: [layer, vectorLayer],
                view: new View({
                    center: center,
                    zoom: 3
                })
            });

        }, 20);

    }, [])
    return <div style={{ height: props.height, width: props.width }} id="genericmap"></div>;
};

export default MapLayer;