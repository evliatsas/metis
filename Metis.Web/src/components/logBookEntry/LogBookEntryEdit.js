import React from 'react'
import LogBookEntryContainer from '../containers/LogBookEntryContainer'
import LogBookEntryHeader from './LogBookEntryHeader'
import {
    DatePicker, Row, Form, Icon, Input, Col, Select, Divider
} from 'antd'
import moment from 'moment'
const locale = {
    itemUnit: 'Χρήστες',
    itemsUnit: 'Χρήστες',
    searchPlaceholder: 'Αναζήτηση'
}
const formItemLayout = {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 18 },
    xl: { span: 12 },
    xxl: { span: 10 }
}
const LogBookEntryView = ({ logBookEntry, members, onCancel, onSave, onDelete }) => {
    if (!logBookEntry) {
        return null
    }

    const logBookEntryChange = event => {
        if (event._d) {
            logBookEntry = ({ ...logBookEntry, close: event._d })
        } else {
            logBookEntry = ({ ...logBookEntry, name: event.target.value })
        }
        //logBookHandler(logBook)
    }
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <LogBookEntryHeader
                logBookEntry={logBookEntry}
                onBack={onCancel}
                onSave={onSave}
                onCancel={onCancel}
                onDelete={onDelete}
            />
            <Form>
                <Row type="flex" justify="center">
                    <Col
                        {...formItemLayout}
                        style={{ padding: 10 }}
                        className="mt-2">
                        <Form.Item label="Τίτλος">
                            <Input
                                value={logBookEntry.title}
                                onChange={logBookEntryChange}
                            />
                        </Form.Item>
                        <Form.Item label="Περιγραφή">
                            <Input
                                value={logBookEntry.description}
                                onChange={logBookEntryChange}
                            />
                        </Form.Item>
                        <Form.Item label="Παραλήπτης">
                            <Select
                                showSearch
                                placeholder="Επιλογή παραλήπτη"
                                optionFilterProp="name" >
                                {members.map(m => (
                                    <Select.Option key={m.userId} value={m.userId}>{m.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div >
    )
}

const LogBookEntryEdit = () => (
    <LogBookEntryContainer>
        <LogBookEntryView />
    </LogBookEntryContainer>
)

export default LogBookEntryEdit
