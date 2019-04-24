import React, { useState, useEffect } from 'react';
import Map from '../../openLayer/MapLayer';
import MapDrawer from './MapDrawer';
import { callFetch } from '../../services/HttpService';

const MapMonitor = () => {
    // const [sidedrawer, setSiderdrawer] = useState(false);
    const [sites, setSites] = useState([]);
    const [selected, setSelected] = useState(null);

    const drawerHandler = (id) => {
        const s = sites.find(x => x.id === id);
        if (s) { setSelected(s); }
    }

    const clearSelected = () => {
        setSelected();
    }
    useEffect(() => {
        callFetch('sites', 'GET').then(res => {
            const filterSites = res.filter(x => x.latitude !== 0)
            console.log(filterSites);
            setSites(filterSites);           
        });
    }, []);

    return <React.Fragment>
        <Map height={'100%'} width={'100%'} sites={sites} selectSite={(id) => drawerHandler(id)} />
        <MapDrawer selected={selected} close={clearSelected} />
    </React.Fragment>

};

export default MapMonitor;