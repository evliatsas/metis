import React, { useState, useRef, useEffect } from 'react';
import {
    PageHeader, DatePicker, Typography, Row,
    Form, Icon, Input, Button, Col, Transfer
} from 'antd';
import storage from '../../services/LocalStorage';
import { callFetch } from '../../services/HttpService';
import './Books.sass';
import moment from 'moment';
const { Paragraph } = Typography;
const formItemLayout = {
    xs: { span: 24 },
    md: { span: 22 },
    lg: { span: 20 },
    xl: { span: 18 },
    xxl: { span: 18 }
};
const locale = {
    itemUnit: 'Χρήστες',
    itemsUnit: 'Χρήστες',
    searchPlaceholder: 'Αναζήτηση'
}
const user = storage.get('auth');
const member = { userId: user.userid, email: user.email, name: user.title }
const Book = props => {
    const id = props.match.params.id ? props.match.params.id : null;
    const title = id ? 'Επεξεργασία Συμβάν' : 'Νέο Συμβάν';
    const routes = [
        { path: 'dashboard', breadcrumbName: 'Αρχική', },
        { path: '', breadcrumbName: title }
    ];
    const [usersToSelect, setUsersToSelect] = useState([]);
    const [usersSelected, setUsersSelected] = useState([]);
    const [date, setDate] = useState(new Date());
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

    useEffect(() => {
        if (id) {
            callFetch('logbooks/' + id, 'GET').then(res => {
                const d = new Date(res.close);
                const m = res.members.map(x => { return x.userId });
                setUsersSelected(last => [...m])
                console.log(m);
                setDate(d)

            });
        }
        callFetch('logbooks/members', 'GET').then(res => {
            // TODO Message 
            setUsersToSelect(prev => res);
        });
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            owner: member,
            close: date,
            members: usersToSelect.filter(f => usersSelected.some(s => s === f.key)),
            name: nameRef.current.state.value
        }
        callFetch('logbooks', 'POST', body).then(res => {
            // TODO Message 
            console.log(res);
        });
    }


    return (
        <Form onSubmit={handleSubmit}>
            <Row type="flex" justify="center">
                <Col {...formItemLayout}>
                    <PageHeader title={title} breadcrumb={{ routes }}>
                        <Paragraph>
                            Δημιουργία νέου Συμβάντος ή επεξεργασία παλαιότερου
                </Paragraph>
                    </PageHeader>
                </Col>
                <Col {...formItemLayout} className="mt-2">
                    <Form.Item label="Τίτλος">
                        <Input prefix={<Icon type="folder-open" />} className="input-width"
                            placeholder="Τίτλος Συμβάν" ref={nameRef} />
                    </Form.Item>
                    <Form.Item label="Ημ/νια Λήξης">
                        <DatePicker value={moment(date, 'L')} placeholder="Επιλογή Ημ/νιας"
                            onChange={dateHandler} className="input-width" />
                    </Form.Item>
                    <Form.Item label="Μέλη για προβολή/επεξεργασία">
                        <Transfer
                            locale={locale}
                            titles={['Επιλογή', 'Επιλεγμένοι']}
                            rowKey={record => record.userId}
                            dataSource={usersToSelect}
                            showSearch
                            listStyle={{
                                width: 250,
                                height: 300,
                            }}
                            targetKeys={usersSelected}
                            onChange={usersHandler}
                            render={item => `${item.name}`}
                        /></Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Αποθήκευση</Button>
                    </Form.Item>
                </Col>

            </Row>
        </Form>

    );
};

export default Book;