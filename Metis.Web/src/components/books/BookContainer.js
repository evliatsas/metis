import React, { useEffect, useState } from 'react';
import { Row, Col, Tag, PageHeader, Typography as T, Tabs, Button, Statistic } from 'antd';
import BookEnties from './BookEnties';
import BookChat from './BookChat';
import { callFetch } from '../../services/HttpService';
import moment from 'moment';
import { calculateStatus } from '../../services/CommonFunctions';
const routes = [
    { path: 'dashboard', breadcrumbName: 'Αρχική' },
    { path: '', breadcrumbName: 'Συμβάν' }
];
const TabPane = Tabs.TabPane;

const Description = ({ term, children }) => (
    <Col span={24}>
        <div>
            <T.Text strong >{term}:</T.Text>
            <span>{children}</span>
        </div>
    </Col>
);


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
    const content = (
        <Row>
            <Description term="Μέλη"> {book.members.length}</Description>
            <Description term="Γεγονότα"> {book.entries.length}</Description>
        </Row>
    );
    return (
        <Row>
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
                    }> {content} </PageHeader>
            </Col>
            <Col span={16}>
                <BookEnties />
            </Col>
            <Col span={8}>
                <BookChat />
            </Col>
        </Row>
    );
};

export default BookContainer;