import React, { useContext } from 'react';
import { AuthContext } from '../../auth/AuthProvider';
//import Navbar from './Navbar';
import { Layout as LayoutC } from 'antd';
import Sidebar from './Sidebar';
import '../../styles/Utilities.sass';

const { Content } = LayoutC;

const Layout = props => {
    const auth = useContext(AuthContext)
    //const navbar = auth.isAuthenticated ? <Navbar /> : null;
    const sidebar = auth.isAuthenticated ? <Sidebar /> : null;
    return (
        <React.Fragment>
            <LayoutC className="is-fullheight">
                {sidebar}
                <LayoutC>
                    {/* {navbar} */}
                    <Content className='calc-h'>
                        {props.children}
                    </Content>
                </LayoutC>
            </LayoutC>
        </React.Fragment>
    );
};

export default Layout;