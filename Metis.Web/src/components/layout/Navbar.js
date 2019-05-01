import React from 'react'
import { Menu as AntdMenu, Icon as AntdIcon } from 'antd'
import './Layout.sass'
import '../../styles/Utilities.sass'

const Navbar = ({ openSidebar }) => (
  <AntdMenu
    mode="horizontal"
    className="has-background-dark mobile-menu"
    selectable={false}>
    <AntdMenu.Item key="99" className="menu-item " onClick={openSidebar}>
      <AntdIcon type="menu" />
    </AntdMenu.Item>
  </AntdMenu>
)

export default Navbar
