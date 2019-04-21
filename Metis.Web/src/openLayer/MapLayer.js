import React, { useEffect } from 'react';
import { transform } from 'ol/proj';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import 'ol/ol.css';
const MapLayer = props => {

    useEffect(() => {
        const center = transform([23.727539, 37.983810], 'EPSG:4326', 'EPSG:3857');
        setTimeout(() => {
            new Map({
                target: 'genericmap',
                layers: [
                    new TileLayer({
                        source: new XYZ({
                            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        })
                    })
                ],
                view: new View({
                    center: center,
                    zoom: 8
                })
            });
        }, 20);

    }, [])
    return <div style={{ height: props.height, width: props.width }} id="genericmap"></div>;
};

export default MapLayer;