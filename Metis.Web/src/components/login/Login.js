import React, { useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthProvider';
import { Form, Icon, Input, Button, Row, Col, Typography } from 'antd';
import { callFetch } from '../../services/HttpService';
import '../../styles/Utilities.sass';
import './Login.sass';

const Login = props => {
    const authContext = useContext(AuthContext);
    const [loginModel, setLoginModel] = useState({
        username: '',
        password: ''
    });
    const inputsHandler = (e) => {
        setLoginModel({
            ...loginModel,
            [e.target.name]: e.target.value
        });
    }
    const clearUsernameHandler = () => {
        setLoginModel({ ...loginModel, username: '' });
    }
    const formItemLayout = { labelCol: { span: 24 }, wrapperCol: { span: 24 } };
    const loginHandler = async () => {
        authContext.signIn();
        // const body = {
        //     username: loginModel.username,
        //     password: loginModel.password
        // }
        // callFetch('http://localhost:50971/api/auth/token', 'POST', body).then(res => {
        //     if (res && res.token) {
        //         authContext.signIn(res.token);
        //     }
        // });

    }
    const clearButton = loginModel.username ? <Icon type="close-circle" onClick={clearUsernameHandler} /> : null;
    return (
        <Row className="is-fullheight login-bck " type="flex" justify="space-around" align="middle">
            <Col lg={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 4 }}>
                <Form className="form-index">
                    <Typography.Title className="has-text-center has-text-white mb-5" level={3}>
                        Σύνδεση
                            </Typography.Title>
                    <Form.Item className="m0 has-text-white"
                        label="Όνομα Χρήστη"
                        {...formItemLayout}>
                        <Input
                            placeholder="Enter your username"
                            name="username"
                            autoComplete="username"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            suffix={clearButton}
                            value={loginModel.username}
                            onChange={inputsHandler} />
                    </Form.Item>
                    <Form.Item
                        className="m0 has-text-white"
                        label="Κωδικός"
                        {...formItemLayout}>
                        <Input.Password
                            autoComplete="password"
                            name="password"
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            value={loginModel.password}
                            onChange={inputsHandler}
                            placeholder="Your password"
                            onPressEnter={loginHandler} />
                    </Form.Item>
                    <Form.Item className="mb-5">
                        <span className="has-text-white" >Ξέχασα τον κωδικό μου</span>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={loginHandler} block> Σύνδεση</Button>
                    </Form.Item>
                </Form>
            </Col>
            <div className='pin pin1'></div>
            <div className='pulse pulse1'></div>
            <div className='pin pin2'></div>
            <div className='pulse pulse2'></div>
            <div className='pin pin3'></div>
            <div className='pulse pulse3'></div>
            <div className='pin pin4'></div>
            <div className='pulse pulse4'></div>
        </Row>
    );
};


export default Login;