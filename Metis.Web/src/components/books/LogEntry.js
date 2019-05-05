import React, { useState, useEffect } from 'react'
import { Form, DatePicker, Input, Select } from 'antd'
import { callFetch } from '../../services/HttpService'
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
const LogEntry = props => {
  const [recipients, setRecipients] = useState([])
  const [log, setLog] = useState({
    dTG: null,
    eCT: null,
    recipient: null,
    priority: null,
    title: '',
    description: ''
  })

  useEffect(() => {
    callFetch('logbooks/members', 'GET').then(res => {
      setRecipients(res)
    })
  }, [])

  const handleFields = (value, field) => {
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


  return (
    <Form {...formItemLayout} onSubmit={submitHandler}>
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
          placeholder="Επιλογή παραλήπτη"
          optionFilterProp="name"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
          {children}
        </Select>
      </Form.Item>
      <Form.Item label="Προτεραιότητα">
        <Select onChange={e => handleFields(e, 'priority')}>
          <Option value={0}>Normal</Option>
          <Option value={1}>Low</Option>
          <Option value={2}>High</Option>
          <Option value={3}>Urgent</Option>
        </Select>
      </Form.Item>
      <Form.Item label="DTG">
        <DatePicker
          className="is-fullwidth"
          onChange={date => handleFields(date._d, 'dTG')}
          placeholder="DateTime given"
        />
      </Form.Item>
      <Form.Item label="ECT">
        <DatePicker
          className="is-fullwidth"
          onChange={date => handleFields(date._d, 'eCT')}
          placeholder="DateTime of completion"
        />
      </Form.Item>
    </Form>
  )
}

export default LogEntry
