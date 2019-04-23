import React, { useEffect } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import { Point } from 'ol/geom';
import { transform, fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import MVT from 'ol/format/MVT';
import Vector from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import VectorTile from 'ol/source/VectorTile';
import { apply } from 'ol-mapbox-style';
import { Circle as CircleStyle, Fill, Icon, Stroke, Style, Image } from 'ol/style';
import 'ol/ol.css';
import darklayer from './darklayer.json'
const MapLayer = props => {

    const styles = {
        'geoMarker': new Style({
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({ color: 'red' }),
                stroke: new Stroke({
                    color: 'white', width: 2
                })
            })
        }),
        'custom': new Style({
            image: new Icon({
                src: "./marker2.png"
            })
        }),
    };

    const createMarkers = () => {
        return props.sites.map(s => {
            return new Feature({
                type: 'geoMarker',
                geometry: new Point(fromLonLat([s.longitude, s.latitude]))               
            });
        });

    }

    var map = new Map({
        target: 'map',
        view: new View({
            center: fromLonLat([25.00, 37.58]),
            zoom: 7
        })
    });
    apply(map, darklayer);
    useEffect(() => {
        const vectorSource = new VectorSource({
            features: createMarkers()
        });
        const markerVectorLayer = new Vector({
            source: vectorSource,
            style: function (feature) {
                return styles[feature.get('type')];
            }
        });
               // return () => {
        //     const features = vectorLayer.getSource().getFeatures();
        //     features.forEach((feature) => {
        //         vectorLayer.getSource().removeFeature(feature);
        //     })
        // }
    }, []);
    return <div style={{ height: props.height, width: props.width }}
        id="map"></div>;
};

export default MapLayer;