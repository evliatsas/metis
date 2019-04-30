import React, { useState, useEffect } from 'react';
import {
    PageHeader, DatePicker, Typography, Row,
    Form, Icon, Input, Button, Col, Transfer, Card
} from 'antd';
import storage from '../../services/LocalStorage';
import { callFetch } from '../../services/HttpService';
import './Books.sass';
import moment from 'moment';
const formItemLayout = {
    xs: { span: 24 },
    lg: { span: 22 },
    xl: { span: 11 },
    xxl: { span: 10 }
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
    const [book, setBook] = useState({
        date: new Date(), title: null
    });

    const bookHandler = (event) => {
        console.log(event);
        setBook({
            ...book,
            title: event.target.value
        })
    }
    const usersHandler = (nextTargetKeys, direction, moveKeys) => {
        if (direction === 'right') {
            setUsersSelected([...nextTargetKeys, usersSelected]);
        } else {
            setUsersSelected([...nextTargetKeys]);
        }
    }
    const dateHandler = (d) => {
        if (!d._d) { return; }
        setBook({ ...book, date: d._d });
    }

    useEffect(() => {
        if (id) {
            callFetch('logbooks/' + id, 'GET').then(res => {
                const d = new Date(res.close);
                const m = res.members.map(x => { return x.userId });
                setUsersSelected(last => [...m])
                console.log(res);
                setBook({
                    title: res.name,
                    date: d
                });

            });
        }
        callFetch('logbooks/members', 'GET').then(res => {
            // TODO Message 
            setUsersToSelect(prev => res);
        });

    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            owner: member,
            close: book.date,
            members: usersToSelect.filter(f => usersSelected.some(s => s === f.key)),
            name: book.title
        }
        callFetch('logbooks', 'POST', body).then(res => {
            // TODO Message 
            console.log(res);
        });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Row type="flex" justify="center" gutter={16}>
                <Col span={24}>
                    <PageHeader title={title} breadcrumb={{ routes }}>
                    </PageHeader>
                </Col>
                <Col {...formItemLayout}
                    className="mt-2" >
                    <Card title="Λεπτομέρειες" size="small" >
                        <Form.Item label="Τίτλος">
                            <Input prefix={<Icon type="folder-open" />} name="title" value={book.title}
                                placeholder="Τίτλος Συμβάν" onChange={bookHandler} />
                        </Form.Item>
                        <Form.Item label="Ημ/νια Λήξης">
                            <DatePicker value={moment(book.date, 'L')} placeholder="Επιλογή Ημ/νιας"
                                onChange={dateHandler} className="is-fullwidth" />
                        </Form.Item>
                        <Button type="primary is-right" htmlType="submit">Αποθήκευση</Button>
                    </Card></Col>
                <Col {...formItemLayout}
                    className="mt-2">
                    <Card title="Επιλογή μέλών για προβολή/επεξεργασία" size="small" >
                        <Form.Item label="">
                            <Transfer
                                locale={locale}
                                titles={['Επιλογή', 'Επιλεγμένοι']}
                                rowKey={record => record.userId}
                                dataSource={usersToSelect}
                                showSearch
                                listStyle={{
                                    height: 400
                                }}
                                targetKeys={usersSelected}
                                onChange={usersHandler}
                                render={item => `${item.name}`}
                            /></Form.Item>
                    </Card>
                </Col>

            </Row>
        </Form>

    );
};

export default Book;