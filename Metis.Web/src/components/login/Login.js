import React, { useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthProvider';
import { Form, Icon, Input, Button, Row, Col, Typography, Card } from 'antd';
import { callFetch } from '../../services/HttpService';
import logo from '../../assets/badge-png-vector-5-transparent.png'
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
        <Row className="is-fullheight login-bck " type="flex" justify="space-around" align="middle">
            <Col lg={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 4 }}>
                <Card size="small" className="card-index">
                    <Form >
                        <Typography.Title className=" mb-5 has-text-dark" level={3}>
                            <img className="logo-login" src={logo} alt="..." /> Σύνδεση
                            </Typography.Title>
                        <Form.Item className="m0 "
                            label={<span className="has-text-dark">Όνομα Χρήστη</span>}
                            {...formItemLayout}>
                            <Input
                                placeholder="Enter your username"
                                name="username"
                                autoComplete="username"
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                suffix={clearButton}
                                className="has-text-dark"
                                value={loginModel.username}
                                onChange={inputsHandler} />
                        </Form.Item>
                        <Form.Item
                            className="m0"
                            label={<span className="has-text-dark">Κωδικός</span>}
                            {...formItemLayout}>
                            <Input.Password
                                autoComplete="password"
                                className="has-text-dark"
                                name="password"
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                value={loginModel.password}
                                onChange={inputsHandler}
                                placeholder="Your password"
                                onPressEnter={loginHandler} />
                        </Form.Item>
                        <Form.Item className="mb-5">
                            <span className="" >Ξέχασα τον κωδικό μου</span>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={loginHandler} block> Σύνδεση</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};


export default Login;