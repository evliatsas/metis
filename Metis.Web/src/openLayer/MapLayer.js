import React, { useEffect, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import { Point } from 'ol/geom';
import { transform, fromLonLat } from 'ol/proj';
import Select from 'ol/interaction/Select';
import XYZ from 'ol/source/XYZ';
import MVT from 'ol/format/MVT';
import Vector from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import VectorTile from 'ol/source/VectorTile';
import { click, pointerMove, altKeyOnly } from 'ol/events/condition';
import { apply } from 'ol-mapbox-style';
import { Circle as CircleStyle, Fill, Icon, Stroke, Style, Image } from 'ol/style';
import 'ol/ol.css';
import darklayer from './darklayer.json';
import marker from '../assets/marker2.png';


const MapLayer = props => {
    const [map, setMap] = useState(null);
    const styles = {
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
    const createMarkers = () => {
        return props.sites.map(s => {
            return new Feature({
                type: 'geoMarker',
                set: { id: s.id },
                geometry: new Point(fromLonLat([s.longitude, s.latitude]))
            });
        });
    }
    const vectorSource = new VectorSource();
    let markerVectorLayer;


    useEffect(() => {
        setTimeout(() => {
            const baseMapLayer = new TileLayer({
                source: new XYZ({
                    url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                })
            });
            let mapbuilder = new Map({
                target: 'genericmap',              
                view: new View({
                    center: fromLonLat([27.00, 38.00]),
                    zoom: 7
                })
            });
            apply(mapbuilder, darklayer);
            setMap(mapbuilder);
        }, 0);

    }, []);
    const select = new Select();
    useEffect(() => {
        if (!map) { return; }
        map.addInteraction(select);
        vectorSource.addFeatures(createMarkers());
        markerVectorLayer = new Vector({
            source: vectorSource,
            style: function (feature) {
                return styles[feature.get('type')];
            }
        });
        map.addLayer(markerVectorLayer);
        // TODO Test if cleanup works properly
        return () => {
            // const features = markerVectorLayer.getSource().getFeatures();
            // features.forEach((feature) => {
            //     markerVectorLayer.getSource().removeFeature(feature);
            // })
        }
    }, [props.sites]);

    select.on('select', function (e) {
        e.preventDefault();
        console.log(e)
        if (e.selected.length === 0) { return; }
        if (e && e.selected && e.selected[0].values_) {
            console.log(e)
            const site = e.selected[0];
            props.selectSite(site.values_.set.id);
        }
    })
    return <div style={{ height: props.height, width: props.width }}
        id="genericmap">
    </div>;
};

export default MapLayer;