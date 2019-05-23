import React from 'react'
import LogBookEditContainer from '../containers/LogBookEditContainer'
import LogBookEditHeader from './LogBookEditHeader'
import {
  DatePicker, Row, Form, Icon, Input, Col, Transfer, Divider
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
  const usersHandler = nextTargetKeys => {
    logBook = {
      ...logBook,
      members: users.filter(f => nextTargetKeys.some(s => s === f.key))
    }
    logBookHandler(logBook)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <LogBookEditHeader
        logBook={logBook}
        onBack={onBack}
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
            <Divider>Λεπτομέρειες</Divider>
            <Form.Item label="Τίτλος">
              <Input
                prefix={<Icon type="folder-open" />}
                name="name"
                value={logBook.name}
                placeholder="Τίτλος Συμβάν"
                onChange={logBookChange}
              />
            </Form.Item>
            <Form.Item label="Ημ/νια Λήξης">
              <DatePicker
                value={moment(logBook.close)}
                placeholder="Επιλογή Ημ/νιας"
                onChange={logBookChange}
                className="is-fullwidth"
              />
            </Form.Item>
            <Divider>Επιλογή μέλών για προβολή/επεξεργασία</Divider>
            <Form.Item label="">
              <Transfer
                locale={locale}
                titles={['Επιλογή', 'Επιλεγμένοι']}
                rowKey={record => record.userId}
                dataSource={users}
                showSearch
                listStyle={{
                  height: 400, width: '45%'
                }}
                targetKeys={logBook.members.map(x => x.userId)}
                onChange={usersHandler}
                render={item => `${item.name}`}
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
