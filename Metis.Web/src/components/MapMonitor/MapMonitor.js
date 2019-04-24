import React, { useState, useEffect } from 'react';
import Map from '../../openLayer/MapLayer';
import MapDrawer from './MapDrawer';
import { callFetch } from '../../services/HttpService';

const MapMonitor = () => {
    const [sidedrawer, setSiderdrawer] = useState(true);
    const [sites, setSites] = useState([]);
    useEffect(() => {
        callFetch('sites', 'GET').then(res => {
            const filterSites = res.filter(x => x.latitude !== 0)
            console.log(filterSites);
            setSites(filterSites);
        });
    }, []);

    return <React.Fragment>
        <Map height={'100%'} width={'100%'} sites={sites} />
        <MapDrawer open={sidedrawer} />
    </React.Fragment>

};

export default MapMonitor;