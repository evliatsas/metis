import React, { useState, useEffect } from 'react'
import { Form, DatePicker, Input, Select, Modal, notification } from 'antd'
import api from '../../services/api'
import { getCurrentMember } from '../../services/CommonFunctions'
import moment from 'moment'
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}
const dateFormat = 'YYYY/MM/DD'
const LogEntry = props => {
  const [recipients, setRecipients] = useState([])
  const [log, setLog] = useState({ ...props.data, issuer: getCurrentMember() })
  useEffect(() => {
    api.get('/api/logbooks/members').then(res => setRecipients(res))
  }, [])

  const handleFields = (value, field) => {
    if (field === 'recipient') {
      value = recipients.find(x => x.userId === value)
    }
    setLog({
      ...log,
      [field]: value
    })
  }
  const children = recipients.map(rec => (
    <Option key={rec.userId} value={rec.userId}>
      {rec.name}
    </Option>
  ))

  const submitHandler = () => {
    if (log.id) {
      api
        .put(`/api/logbooks/${log.logBookId}/entries/${log.id}`, log)
        .then(res => {
          notification['success']({
            message: 'Επιτυχής καταχώρηση',
          })
          props.onClose(log, true)
        })
    } else {
      api
        .post(`/api/logbooks/${log.logBookId}/entries`, log)
        .then(res => {
          notification['success']({
            message: 'Επιτυχής καταχώρηση',
          })
          props.onClose(log, true)
        })
    }
  }

  return (
    <Modal
      title={log && log.id ? 'Νέο Γεγονός' : 'Επεξεργασία'}
      visible={true}
      onOk={submitHandler}
      cancelButtonProps={{ type: 'danger' }}
      onCancel={() => props.onClose(null)}>
      <Form {...formItemLayout}>
        <Form.Item label="Τίτλος">
          <Input
            value={log.title}
            onChange={e => handleFields(e.target.value, 'title')}
          />
        </Form.Item>
        <Form.Item label="Περιγραφή">
          <Input
            value={log.description}
            onChange={e => handleFields(e.target.value, 'description')}
          />
        </Form.Item>
        <Form.Item label="Παραλήπτης">
          <Select
            showSearch
            defaultValue={log && log.recipient ? log.recipient.userId : null}
            placeholder="Επιλογή παραλήπτη"
            optionFilterProp="name"
            onSelect={id => handleFields(id, 'recipient')}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }>
            {children}
          </Select>
        </Form.Item>
        <Form.Item label="Προτεραιότητα">
          <Select
            defaultValue={log.priority}
            onChange={e => handleFields(e, 'priority')}>
            <Option value={0}>Normal</Option>
            <Option value={1}>Low</Option>
            <Option value={2}>High</Option>
            <Option value={3}>Urgent</Option>
          </Select>
        </Form.Item>
        <Form.Item label="DTG">
          <DatePicker
            defaultValue={log.dtg ? moment(log.dtg, dateFormat) : null}
            className="is-fullwidth"
            onChange={date => handleFields(date._d, 'dtg')}
            placeholder="DateTime given"
          />
        </Form.Item>
        <Form.Item label="ECT">
          <DatePicker
            defaultValue={log.ect ? moment(log.ect, dateFormat) : null}
            className="is-fullwidth"
            onChange={date => handleFields(date._d, 'ect')}
            placeholder="DateTime of completion"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default LogEntry
