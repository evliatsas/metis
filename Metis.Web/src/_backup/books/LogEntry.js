import React, { useState, useEffect } from 'react'
import { Form, DatePicker, Input, Select, Modal, notification, Button, Tag } from 'antd'
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
const currentUser = getCurrentMember()
const dateFormat = 'YYYY/MM/DD HH:mm'
const LogEntry = props => {
  const [recipients, setRecipients] = useState([])
  const initData = {
    ...props.data,
    'issuer': props.data.id ? props.data.issuer : currentUser
  }
  const [log, setLog] = useState({ ...initData })
  const isCompleted = log.status === 1;
  useEffect(() => {
    api.get('/api/logbooks/members').then(res => setRecipients(res))
  }, [])

  const canEdit = () => {
    return log.issuer.userId === currentUser.userId ||
      log.recipient.userId === currentUser.userId
  }
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
    if (isCompleted) {
      props.onClose(null, true)
      return
    }
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

  const completeEntry = () => {
    api
      .get(`/api/logbooks/${log.logBookId}/entries/${log.id}/close`)
      .then(res => {
        notification['success']({
          message: 'Επιτυχής καταχώρηση',
        })
        props.onClose(res, true)
      })
  }

  const completionTimeButton = isCompleted ?
    <Tag color="#40861d">{moment(log.completionTime).format('LLL')}</Tag> :
     <Button disabled={!canEdit()} type="primary" onClick={completeEntry} block>Ολοκλήρωση</Button> 

  return (
    <Modal
      title={log && log.id ? 'Νέο Γεγονός' : 'Επεξεργασία'}
      visible={true}
      onOk={submitHandler}
      cancelButtonProps={{ type: 'danger' }}
      onCancel={() => props.onClose(null)}>
      <Form {...formItemLayout}>
        <Form.Item label="Τίτλος">
          <Input disabled={isCompleted || !canEdit()}
            value={log.title}
            onChange={e => handleFields(e.target.value, 'title')}
          />
        </Form.Item>
        <Form.Item label="Περιγραφή">
          <Input disabled={isCompleted || !canEdit()}
            value={log.description}
            onChange={e => handleFields(e.target.value, 'description')}
          />
        </Form.Item>
        <Form.Item label="Παραλήπτης">
          <Select
            showSearch disabled={isCompleted || !canEdit()}
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
            defaultValue={log.priority} disabled={isCompleted || !canEdit()}
            onChange={e => handleFields(e, 'priority')}>
            <Option value={0}>Normal</Option>
            <Option value={1}>Low</Option>
            <Option value={2}>High</Option>
            <Option value={3}>Urgent</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Ενέργειες">
          <Input.TextArea disabled={isCompleted || !canEdit()} placeholder="Ενέργειες παραλήπτη" value={log.actions}
            onChange={e => handleFields(e.target.value, 'actions')}
            autosize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        <Form.Item label="DTG">
          <DatePicker disabled={isCompleted || !canEdit()}
            defaultValue={log.dtg ? moment(log.dtg, dateFormat) : null}
            className="is-fullwidth"
            onChange={date => handleFields(date._d, 'dtg')}
            placeholder="DateTime given"
          />
        </Form.Item>
        <Form.Item label="ECT">
          <DatePicker disabled={isCompleted || !canEdit()}
            defaultValue={log.ect ? moment(log.ect, dateFormat) : null}
            className="is-fullwidth"
            onChange={date => handleFields(date._d, 'ect')}
            placeholder="DateTime of completion"
          />
        </Form.Item>
        {log.id ? <Form.Item label="Ολοκλήρωση">
          {completionTimeButton}
        </Form.Item> : null}
      </Form>
    </Modal>
  )
}

export default LogEntry
