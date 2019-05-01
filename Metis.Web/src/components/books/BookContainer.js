import React, { useEffect, useState } from 'react';
import { Row, Col, PageHeader, Typography as T, Tabs, Button } from 'antd';

import BookEntries from './BookEntries';
import BookChat from './BookChat';
import { callFetch } from '../../services/HttpService';
import moment from 'moment';
import { calculateStatus } from '../../services/CommonFunctions';
const TabPane = Tabs.TabPane;

const BookContainer = props => {
    const id = props.match.params.id ? props.match.params.id : null;
    const [book, setBook] = useState({ members: [], entries: [] });

    useEffect(() => {
        if (id) {
            callFetch('logbooks/' + id, 'GET').then(res => {
                console.log(res);
                setBook(res);
            });
        }
    }, []);

    const lastupdate = moment(book.lastUpdate).fromNow() 
    return (
        <Row className="is-fullheight">
            <Col span={24}>
                <PageHeader
                    onBack={() => window.history.back()}
                    title={book.name}
                    subTitle={lastupdate + " ενημερώθηκε"}
                    tags={calculateStatus(book.close)}
                    extra={[
                        <Button key="1" type="primary" size="small" onClick={() => props.history.push('/book/' + book.id)}
                        > επεξεργασία </Button>]}
                    footer={
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Γεγονότα" key="1" />
                            <TabPane tab="Μέλη" key="2" />
                        </Tabs>
                    }></PageHeader>
            </Col>
            <Col span={16}>
                <BookEntries data={props.data} />
            </Col>
            <Col span={8} className="chat-container">
                <BookChat />
            </Col>
        </Row>
    );
};

export default BookContainer;