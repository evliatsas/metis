import React from 'react';
import { NavLink } from 'react-router-dom'
import { Icon as AntdIcon, Avatar as AntdAvatar } from 'antd'
import { useAuth } from '../../contexts/AuthProvider'
import logo from '../../assets/logo.png'
import './sidebar.less'

const MobileMenu = () => {
    const auth = useAuth()
    return (
        <div className="bottom-menu-container">
            <NavLink className="mobile-menu-item" to='/map'>
                <AntdIcon type='global' />
            </NavLink>
            <NavLink className="mobile-menu-item" to='/logbooks' >
                <AntdIcon type='notification' />
            </NavLink>
            <NavLink className="mobile-menu-item" to='/map'>
                <AntdAvatar size={48} src={logo} alt="metis" />
            </NavLink>
            <NavLink className="mobile-menu-item" to='/logbooks'>
                <AntdIcon type='plus' />
            </NavLink>
            <div className="mobile-menu-item is-link" onClick={auth.signOut}>
                <AntdIcon type='logout' />
            </div>

        </div>
    );
};

export default MobileMenu;