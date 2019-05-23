import React from 'react'
import LogBookEditContainer from '../containers/LogBookEditContainer'
import LogBookEditHeader from './LogBookEditHeader'
import './logBookEdit.less'
import {
  DatePicker, Row, Form, Icon, Input, Col, Select, List, Button as AntdButton
} from 'antd'
import moment from 'moment'
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 10 }
  },
};
const LogBookEditView = ({ logBook, onBack, onSave, onCancel, users, logBookHandler, onDelete }) => {
  if (!logBook) {
    return null
  }

  const logBookChange = event => {
    if (event._d) {
      logBook = ({ ...logBook, close: event._d })
    } else {
      logBook = ({ ...logBook, name: event.target.value })
    }
    logBookHandler(logBook)
  }
  const usersHandler = userId => {
    const m = users.find(x => x.userId === userId)
    logBook.members.push(m)
    logBook = { ...logBook }
    logBookHandler(logBook)
  }

  const removeUser = userId => {
    const index = logBook.members.findIndex(x => x.userId === userId)
    logBook.members.splice(index, 1)
    logBook = { ...logBook }
    logBookHandler(logBook)
  }

  return (
    <div style={{ height: '100%' }} >
      <LogBookEditHeader
        logBook={logBook}
        onBack={onBack}
        onSave={onSave}
        onCancel={onCancel}
        onDelete={onDelete}
      />
      <Form style={{ marginTop: 20, width: '100%' }} {...formItemLayout}>
        <Row type="flex" justify="center" gutter={20}>
          <Col xs={24}>
            <Form.Item label="Τίτλος"  >
              <Input
                prefix={<Icon type="folder-open" />}
                name="name"
                value={logBook.name}
                placeholder="Τίτλος Συμβάν"
                onChange={logBookChange}
              />
            </Form.Item>
            <Form.Item label="Ημ/νια Λήξης" >
              <DatePicker
                value={moment(logBook.close)}
                placeholder="Επιλογή Ημ/νιας"
                onChange={logBookChange}
              />
            </Form.Item>
            <Form.Item label="Μέλη">
              <Select
                showSearch
                placeholder="Επιλογή Μέλους"
                optionFilterProp="name"
                onChange={usersHandler}>
                {users.map(m => (
                  <Select.Option key={m.userId} value={m.userId}>{m.name}</Select.Option>
                ))}
              </Select>
              <List
                size="small"
                header={<div style={{ color: 'white' }}>Επιλεγμένα Μέλη</div>}
                bordered
                dataSource={logBook.members}
                renderItem={item => <List.Item actions={[
                  <AntdButton className="btn-xs" onClick={() => removeUser(item.userId)}
                    size="small"
                    type="danger"
                    ghost
                    shape="circle"
                    icon="close"
                  />]
                }>{item.name}</List.Item>}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

const LogBookEdit = () => (
  <LogBookEditContainer>
    <LogBookEditView />
  </LogBookEditContainer>
)

export default LogBookEdit
