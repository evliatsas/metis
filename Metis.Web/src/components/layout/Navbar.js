import React, { useContext } from 'react';
import { AuthContext } from '../../auth/AuthProvider';
import { Menu, Icon, Layout } from 'antd';
import './Layout.sass';
import '../../styles/Utilities.sass';
const { Header } = Layout;
const Navbar = props => {
    const auth = useContext(AuthContext);
    return (
        <Header className="header">
            <Menu mode="horizontal" className="menu" selectable={false}>
                <Menu.Item key="99" className="menu-item is-right" onClick={auth.signOut}>
                    <Icon type="logout" />Αποσύνδεση
                </Menu.Item>
               

            </Menu>
        </Header>

    );
};

export default Navbar;