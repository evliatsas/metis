import React, { useEffect, useState } from 'react';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import Select from 'ol/interaction/Select';
import Vector from 'ol/layer/Vector';
import { Circle as CircleStyle, Fill, Style, Text } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import { Cluster } from 'ol/source';
import { apply } from 'ol-mapbox-style';
import darklayer from './darklayer.json';
import { addMarkers, alarm } from './MapFunctions';
const MapLayer = props => {
    const [map, setMap] = useState(null);
    const featuresSource = new VectorSource();
    const select = new Select();

    useEffect(() => {
        setTimeout(() => {
            let mapbuilder = new Map({
                target: 'genericmap',
                controls: [],
                view: new View({
                    center: fromLonLat([27.00, 38.00]),
                    zoom: 7
                })
            });
            apply(mapbuilder, darklayer);
            setMap(mapbuilder);
        }, 0);

    }, []);

    useEffect(() => {
        if (!map) { return; }
        const styleCache = {};
        map.addInteraction(select);
        featuresSource.addFeatures(addMarkers(props.sites));
        const clusterSource = new Cluster({
            distance: 20,
            source: featuresSource
        });

        const clusters = new Vector({
            source: clusterSource,
            style: function (feature) {
                const size = feature.get('features').length;
                let style = styleCache[size];
                const color = alarm(feature.get('features'));
                if (!style) {
                    style = new Style({
                        image: new CircleStyle({
                            radius: 12,
                            fill: new Fill({
                                color: color
                            })
                        }),
                        text: new Text({
                            text: size.toString(),
                            fill: new Fill({
                                color: '#fff'
                            })
                        })
                    });
                    styleCache[size] = style;
                }
                return style;
            }
        });
        map.addLayer(clusters);
        // TODO Test if cleanup works properly
        return () => {
            // const features = markerVectorLayer.getSource().getFeatures();
            // features.forEach((feature) => {
            //     markerVectorLayer.getSource().removeFeature(feature);
            // })
        }
    }, [props.sites]);

    select.on('select', function (e) {
        console.log(e);
        e.preventDefault();
        if (e.selected.length === 0) { return; }
        if (e.selected[0].values_ && e.selected[0].values_.features.length > 1) { return; }
        if (e && e.selected && e.selected[0].values_) {
            const site = e.selected[0].values_.features[0];
            props.selectSite(site.values_.set.id);
        }
    });

    return <div style={{ height: props.height, width: props.width }}
        id="genericmap">
    </div>;
};

export default MapLayer;