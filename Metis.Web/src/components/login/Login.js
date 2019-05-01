import React, { useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthProvider';
import { Form, Icon, Input, Button, Row, Col, Typography, Divider, Comment, Avatar, } from 'antd';
import { callFetch } from '../../services/HttpService';
import logo from '../../assets/badge-png-vector-5-transparent.png'
import '../../styles/Utilities.sass';
import './Login.sass';

const Login = () => {
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
    const loginHandler = async () => {
        const body = {
            username: loginModel.username,
            password: loginModel.password
        }
        callFetch('token', 'POST', body).then(res => {
            if (res && res.token) {
                authContext.signIn(res.token);
            }
        });

    }
    const clearButton = loginModel.username ? <Icon type="close-circle" onClick={clearUsernameHandler} /> : null;
    return (
        <Row className="is-fullheight" type="flex" justify="center" align="middle">
            <Col xs={{ span: 0 }} md={{ span: 11 }} xl={{ span: 7 }} xxl={{ span: 5 }}>
                <Comment
                    author={<Typography.Title className="metis-title" level={4}>Metis</Typography.Title>}
                    avatar={(
                        <Avatar size={124}
                            src={logo} alt="TODO" />
                    )}
                    content={(
                        <p className="content-fix">Some text that they will propably provide for use about the application. Otherwise
                        some basic info about what this application does.</p>
                    )}
                />
            </Col>
            <Col xs={{ span: 0 }} md={{ span: 1 }} className="has-text-centered">
                <Divider type="vertical" className="divider" />
            </Col>

            <Col xs={{ span: 21 }} md={{ span: 11 }} xl={{ span: 7 }} xxl={{ span: 5 }}>

                <Form >
                    <Typography.Title className="mb-5" level={2}>
                        Σύνδεση
                    </Typography.Title>
                    <Form.Item>
                        <Input
                            placeholder="Συμπληρώστε όνομα χρήστη"
                            size="large"
                            name="username"
                            autoComplete="username"
                            prefix={<Icon type="user" />}
                            suffix={clearButton}
                            className="has-text-dark"
                            value={loginModel.username}
                            onChange={inputsHandler} />
                    </Form.Item>
                    <Form.Item>
                        <Input.Password
                            autoComplete="password"
                            size="large"
                            className="has-text-dark"
                            name="password"
                            prefix={<Icon type="lock" />}
                            value={loginModel.password}
                            onChange={inputsHandler}
                            placeholder="Ο κωδικός σας"
                            onPressEnter={loginHandler} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" size="large"
                            onClick={loginHandler} block> Σύνδεση</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};


export default Login;