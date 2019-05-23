import React from 'react'
import LogBookEntryContainer from '../containers/LogBookEntryContainer'
import LogBookEntryHeader from './LogBookEntryHeader'
import {
    DatePicker, Row, Form, Icon, Input, Col, Select, Divider
} from 'antd'
import moment from 'moment'
const dateFormat = 'YYYY/MM/DD'
const formItemLayout = {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 18 },
    xl: { span: 12 },
    xxl: { span: 10 }
}
const LogBookEntryView = ({ logBookEntry, members, onCancel, onSave, onDelete, logBookHandler }) => {
    if (!logBookEntry) {
        return null
    }
    console.log(logBookEntry)
    const logBookEntryChange = (event, field) => {
        switch (field) {
            case 0:
                logBookEntry = ({ ...logBookEntry, [event.target.name]: event.target.value })
                break;
            case 1:
                logBookEntry = ({ ...logBookEntry, ect: event._d })
                break;
            case 2:
                logBookEntry = ({ ...logBookEntry, dtg: event._d })
                break;
            case 3:
                logBookEntry = ({ ...logBookEntry, priority: event })
                break;
            case 4:
                logBookEntry = ({ ...logBookEntry, recipient: members.find(x => x.userId == event) })
                break;
        }
        logBookHandler(logBookEntry)
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
                                name="title"
                                value={logBookEntry.title}
                                onChange={e => logBookEntryChange(e, 0)}
                            />
                        </Form.Item>
                        <Form.Item label="Περιγραφή">
                            <Input
                                name="description"
                                value={logBookEntry.description}
                                onChange={e => logBookEntryChange(e, 0)}
                            />
                        </Form.Item>
                        <Form.Item label="Παραλήπτης">
                            <Select
                                showSearch
                                placeholder="Επιλογή παραλήπτη"
                                optionFilterProp="name"
                                defaultValue={logBookEntry.recipient.userId}
                                onChange={e => logBookEntryChange(e, 4)}>
                                {members.map(m => (
                                    <Select.Option key={m.userId} value={m.userId}>{m.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Προτεραιότητα">
                            <Select
                                defaultValue={logBookEntry.priority}
                                onChange={e => logBookEntryChange(e, 3)}>
                                <Select.Option value={0}>Κανονική</Select.Option>
                                <Select.Option value={1}>Δευτερεύων</Select.Option>
                                <Select.Option value={2}>Επείγον</Select.Option>
                                <Select.Option value={3}>Άμεσο</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Ενέργειες">
                            <Input.TextArea placeholder="Ενέργειες παραλήπτη" value={logBookEntry.actions}
                                name="actions"
                                onChange={e => logBookEntryChange(e, 0)}
                                autosize={{ minRows: 4, maxRows: 4 }} />
                        </Form.Item>
                        <Form.Item label="DTG">
                            <DatePicker
                                defaultValue={logBookEntry.dtg ? moment(logBookEntry.dtg, dateFormat) : null}
                                className="is-fullwidth"
                                onChange={e => logBookEntryChange(e, 2)}
                                placeholder="DateTime given"
                            />
                        </Form.Item>
                        <Form.Item label="ECT">
                            <DatePicker
                                defaultValue={logBookEntry.ect ? moment(logBookEntry.ect, dateFormat) : null}
                                className="is-fullwidth"
                                onChange={e => logBookEntryChange(e, 1)}
                                placeholder="DateTime of completion"
                            />
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
