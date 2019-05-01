import React, { useContext, useState } from 'react'
import { AuthContext } from '../../auth/AuthProvider'
import Navbar from './Navbar'
import { Layout as AntdLayout } from 'antd'
import Sidebar from './Sidebar'
import '../../styles/Utilities.sass'

const { Content } = AntdLayout

const Layout = props => {
  const [collapsed, setCollapsed] = useState(false)
  const toggleCollapsed = () => setCollapsed(!collapsed)

  const auth = useContext(AuthContext)
  const navbar = auth.isAuthenticated ? (
    <Navbar openSidebar={toggleCollapsed} />
  ) : null
  const sidebar = auth.isAuthenticated ? (
    <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
  ) : null

  return (
    <React.Fragment>
      <AntdLayout className="is-fullheight">
        {sidebar}
        <AntdLayout>
          {navbar}
          <Content className="calc-h">{props.children}</Content>
        </AntdLayout>
      </AntdLayout>
    </React.Fragment>
  )
}

export default Layout
