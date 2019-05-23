import React from 'react'
import UserContainer from '../containers/admin/UserContainer'
import PageHeader from '../shared/PageHeader'
import {
  Select, Row, Form, Icon, Input, Col, List, Button as AntdButton
} from 'antd'
const STRINGS = {
  SUBTITLE_NEW: 'δημιουργία χρήστη',
  SUBTITLE_EDIT: 'επεξεργασία χρήστη',
  SAVE: 'Αποθήκευση',
  CANCEL: 'Ακύρωση'
}
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

const UserView = ({ user, sites, onSave, onCancel, onBack, userHandler }) => {
  if (!user) {
    return null
  }

  const userChange = event => {
    user = ({ ...user, [event.targe.name]: event.target.value })
    userHandler(user)
  }
  return (
    <div>
      <PageHeader
        title={user.title}
        subtitle={user.id ? STRINGS.SUBTITLE_EDIT : STRINGS.SUBTITLE_NEW}
        onBack={onBack}
        actions={[
          {
            caption: STRINGS.CANCEL,
            onClick: onCancel
          },
          {
            caption: STRINGS.SAVE,
            onClick: onSave
          }
        ]}
      />
      <Form style={{ marginTop: 20, width: '100%' }} {...formItemLayout}>
        <Row type="flex" justify="center" gutter={20}>
          <Col xs={24}>
            <Form.Item label="Τίτλος"  >
              <Input
                prefix={<Icon type="folder-open" />}
                name="title"
                value={user.title}
                onChange={userChange}
              />
            </Form.Item>
            <Form.Item label="Username" >
              <Input
                prefix={<Icon type="folder-open" />}
                name="username"
                value={user.username}
                onChange={userChange}
              />
            </Form.Item>

            <Form.Item label="Κωδικός" >
              <Input
                prefix={<Icon type="folder-open" />}
                name="email"
                value={user.email}
                onChange={userChange}
              />
            </Form.Item>
            <Form.Item label="Κωδικός" >
              <Input
                prefix={<Icon type="folder-open" />}
                name="password"
                value={user.password}
                placeholder="Τίτλος Mέλους"
                onChange={userChange}
              />
            </Form.Item>
            <Form.Item label="Ρόλος">
              <Select
                value={user.role}>
                <Select.Option value={0}>Viewer</Select.Option>
                <Select.Option value={1}>Manager</Select.Option>
                <Select.Option value={2}>Administrator</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Sites">
              <Select
                showSearch
                placeholder="Επιλογή Site"
                optionFilterProp="name">
                {sites.map(s => (
                  <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                ))}
              </Select>
              <List
                size="small"
                header={<div style={{ color: 'white' }}>Site προς διαχείριση</div>}
                bordered
                dataSource={user.sites}
                renderItem={item => <List.Item actions={[
                  <AntdButton className="btn-xs"
                    size="small"
                    type="danger"
                    ghost
                    shape="circle"
                    icon="close"
                  />]
                }>{(sites.find(x => x.id == item)).name}</List.Item>}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

const User = () => (
  <UserContainer>
    <UserView />
  </UserContainer>
)

export default User
