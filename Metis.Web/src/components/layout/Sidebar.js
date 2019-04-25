import React, { useContext } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/badge-png-vector-5-transparent.png';
import storage from '../../services//LocalStorage';
import { AuthContext } from '../../auth/AuthProvider';
import './Layout.sass';
const { Sider } = Layout;

const Sidebar = props => {
    const auth = useContext(AuthContext);
    const username = storage.get('auth');

    return (
        <Sider collapsed={props.collapsed} collapsedWidth={80} breakpoint={{
            xs: '480px',
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            xxl: '1600px',
        }} onCollapse={(collapsed, type) => { console.log(collapsed, type) }}
            onBreakpoint={(broken) => console.log(broken)}	>
            <Menu selectable={false}
                mode="vertical"
                className="is-fullheight sidebar">
                <div className="logo-item" key="0">
                    <img className="logo" src={logo} alt="..." />
                    <span className="ml-1 line" >Metis</span>
                </div>
                <Menu.Item key="name" className="mb-5">
                    <span className="user-profile">
                        <Icon type="user" />
                        <span>{username.title}</span>
                    </span>
                </Menu.Item>
                <Menu.Item key="1" onClick={props.toggleCollapsed}>
                    <span>
                        <Icon type={props.collapsed ? 'menu-unfold' : 'menu-fold'} />
                        <span>Ελαχιστοποίηση</span>
                    </span>
                </Menu.Item>
                <Menu.Item key="2" >
                    <NavLink to="/dashboard" >
                        <Icon type="home" />
                        <span>Αρχική</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="3">
                    <NavLink to="/surveillance">
                        <Icon type="global" />
                        <span>Τεστ Χαρτης</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="4">
                    <NavLink to="/events">
                        <Icon type="notification" />
                        <span>Συμβάντα</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item className="bottom-menu-item" key="99" onClick={auth.signOut}>
                    <span>
                        <Icon type="logout" />
                        <span>Αποσύνδεση</span>
                    </span>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;