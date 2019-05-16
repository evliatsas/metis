import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Layout as AntdLayout,
  Menu as AntdMenu,
  Icon as AntdIcon,
  Avatar as AntdAvatar
} from 'antd'
import { AuthContext } from '../../contexts/AuthProvider'
import logo from '../../assets/logo.png'

const items = [
  {
    path: '/map',
    icon: 'global',
    caption: 'Map'
  }
]

const Sidebar = () => {
  const auth = useContext(AuthContext)
  return (
    <AntdLayout.Sider collapsed={true}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0px 40px 0px'
          }}>
          <AntdAvatar size={48} src={logo} alt="metis" />
        </div>
        <AntdMenu selectable={false} mode="vertical" className="sidebar-menu">
          {items.map(item => (
            <AntdMenu.Item key={item.path} className="sidebar-menu-item">
              <NavLink to={item.path}>
                <AntdIcon type={item.icon} />
                <span>{item.caption}</span>
              </NavLink>
            </AntdMenu.Item>
          ))}
        </AntdMenu>
        <div style={{ flexGrow: '1' }} />
        <AntdMenu
          selectable={false}
          mode="vertical"
          style={{ backgroundColor: 'unset' }}
          className="sidebar-menu">
          <AntdMenu.Item
            key="/logout"
            onClick={auth.signOut}
            style={{ justifySelf: 'flex-end' }}
            className="sidebar-logout">
            <span>
              <AntdIcon type="logout" />
              <span>Αποσύνδεση</span>
            </span>
          </AntdMenu.Item>
        </AntdMenu>
      </div>
    </AntdLayout.Sider>
  )
}

export default Sidebar
