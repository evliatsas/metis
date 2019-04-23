import React from 'react';
import { Drawer } from 'antd';

const MapDrawer = props => {

    return (
        <Drawer
          
            placement="right"
            closable={true}
            onClose={props.close}
            visible={props.open}
            mask={false}
        >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Drawer>
    );
};

export default MapDrawer;