import React, { useContext } from 'react'
import { Layout as AntdLayout, Menu as AntdMenu, Icon as AntdIcon } from 'antd'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import storage from '../../services/storage'
import { AuthContext } from '../../auth/AuthProvider'
import './Layout.sass'

const breakpoints = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px'
}

const Sidebar = ({ collapsed, toggleCollapsed }) => {
  const auth = useContext(AuthContext)
  const username = storage.get('auth')

  return (
    <AntdLayout.Sider
      collapsed={collapsed}
      collapsedWidth={80}
      breakpoint={breakpoints}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type)
      }}
      onBreakpoint={broken => console.log(broken)}>
      <AntdMenu
        selectable={false}
        mode="vertical"
        className="is-fullheight sidebar">
        <div className="logo-item" key="0">
          <img className="logo" src={logo} alt="..." />
          <span className="ml-1">Metis</span>
        </div>
        <AntdMenu.Item key="name" className="mb-5">
          <span className="user-profile">
            <AntdIcon type="user" />
            <span>{username.title}</span>
          </span>
        </AntdMenu.Item>
        {/* <AntdMenu.Item key="1" onClick={toggleCollapsed}>
          <span>
            <AntdIcon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
            <span>Ελαχιστοποίηση</span>
          </span>
        </AntdMenu.Item> */}
        <AntdMenu.Item key="2">
          <NavLink to="/dashboard">
            <AntdIcon type="home" />
            <span>Αρχική</span>
          </NavLink>
        </AntdMenu.Item>
        <AntdMenu.Item key="3">
          <NavLink to="/map">
            <AntdIcon type="global" />
            <span>Χάρτης</span>
          </NavLink>
        </AntdMenu.Item>
        <AntdMenu.SubMenu
          key="4"
          title={
            <span>
              <AntdIcon type="notification" />
              <span>Συμβάντα</span>
            </span>
          }>
          <AntdMenu.Item key="5">
            <NavLink to="/book/new">Νέο Συμβάν</NavLink>
          </AntdMenu.Item>
          <AntdMenu.Item key="6">
            <NavLink to="/books">Συμβάντα</NavLink>
          </AntdMenu.Item>
        </AntdMenu.SubMenu>
        <AntdMenu.Item
          className="bottom-menu-item"
          key="99"
          onClick={auth.signOut}>
          <span>
            <AntdIcon type="logout" />
            <span>Αποσύνδεση</span>
          </span>
        </AntdMenu.Item>
      </AntdMenu>
    </AntdLayout.Sider>
  )
}

export default Sidebar
