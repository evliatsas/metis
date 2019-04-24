import React from 'react';
import { Menu, Icon } from 'antd';
import './Layout.sass';
import '../../styles/Utilities.sass';
const Navbar = props => {
    return (
        <Menu mode="horizontal" className="has-background-dark mobile-menu" selectable={false}>
            <Menu.Item key="99" className="menu-item " onClick={props.openSidebar}>
                <Icon type="menu" />
            </Menu.Item>
        </Menu>

    );
};

export default Navbar;