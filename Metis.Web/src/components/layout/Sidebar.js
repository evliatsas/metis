import React, { useState } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import './Layout';
const { Sider } = Layout;
const Sidebar = props => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    }
    return (
        <Sider className="sidebar" collapsed={collapsed}>
            <Menu selectable={false}
                mode="vertical"
                className="is-fullheight">
                <div className="logo-item" key="0">
                    {/* <img src={logo}  alt='..'/> */}
                    <span className="logo" >Metis</span>
                </div>
                <Menu.Item key="1" onClick={toggleCollapsed}>
                    <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
                    <span>Ελαχιστοποίηση</span>
                </Menu.Item>
                <Menu.Item key="2">
                    <NavLink to="/">
                        <Icon type="home" />
                        <span>Αρχική</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="3">
                    <NavLink to="/eob">
                        <Icon type="global" />
                        <span>Τεστ Χαρτης</span>
                    </NavLink>
                </Menu.Item>               
            </Menu>
        </Sider>
    );
};

export default Sidebar;