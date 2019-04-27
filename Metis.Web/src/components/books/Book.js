import React, { useState, useRef, useEffect } from 'react';
import {
    PageHeader, DatePicker, Typography, Row,
    Form, Icon, Input, Button, Col, Transfer
} from 'antd';
import storage from '../../services/LocalStorage';
import { callFetch } from '../../services/HttpService';
const { Paragraph } = Typography;
const formItemLayout = {
    xs: { span: 24, offset: 0 },
    md: { span: 22, offset: 1 },
    lg: { span: 20, offset: 2 },
    xl: { span: 18, offset: 3 },
    xxl: { span: 16, offset: 4 },
};
const routes = [
    {
        path: 'dashboard',
        breadcrumbName: 'Dashboard',
    },
    {
        path: '',
        breadcrumbName: 'New Event',
    }
];
const user = storage.get('auth');
const member = { userId: user.userid, email: user.email, name: user.title }
const Book = () => {
    const [usersToSelect, setUsersToSelect] = useState([{ title: 'nikos1', description: 'sadad', key: '1' }, { title: 'nikos2', description: 'sadad', key: '2' }]);
    const [usersSelected, setUsersSelected] = useState([]);
    const [date, setDate] = useState();
    const nameRef = useRef();

    const usersHandler = (nextTargetKeys, direction, moveKeys) => {
        if (direction === 'right') {
            setUsersSelected([...nextTargetKeys, usersSelected]);
        } else {
            setUsersSelected([...nextTargetKeys]);
        }

    }
    const dateHandler = (d) => {
        if (!d._d) { return; }
        setDate(d._d);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            owner: member,
            close: date,
            members: usersToSelect.filter(f => usersSelected.some(s => s === f.key)),
            name: nameRef.current.state.value
        }
        callFetch('logbooks', 'POST', body).then(res => {
            console.log(res);
        });
        console.log(body);
    }

    const locale = {
        itemUnit: 'User',
        itemsUnit: 'Users',
        searchPlaceholder: 'Αναζήτηση'
    }
    return (
        <Row>
            <Col {...formItemLayout}> <PageHeader title="New Event" breadcrumb={{ routes }}>
                <Paragraph>
                    Create New Log Book by providing a name an expiration data and users that can view and edit it.
                </Paragraph>
            </PageHeader></Col>
            <Col {...formItemLayout}>
                <Form onSubmit={handleSubmit}>
                    <Form.Item label="Name">
                        <Input prefix={<Icon type="folder-open" />} placeholder="Event name" ref={nameRef} />
                    </Form.Item>
                    <Form.Item label="Expired">
                        <DatePicker onChange={dateHandler} />
                    </Form.Item>
                    <Form.Item label="Users for View">
                        <Transfer
                            locale={locale}
                            titles={['Choose', 'Users']}
                            dataSource={usersToSelect}
                            showSearch
                            listStyle={{
                                width: 250,
                                height: 300,
                            }}
                            targetKeys={usersSelected}
                            onChange={usersHandler}
                            render={item => `${item.title}-${item.description}`}
                        /></Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Register</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>

    );
};

export default Book;