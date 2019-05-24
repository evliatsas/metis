import React, { useState } from 'react'
import SiteContainer from '../containers/admin/SiteContainer'
import PageHeader from '../shared/PageHeader'
import {
  Select, Row, Form, Icon, Input, Col, List, Popconfirm as AntdPopconfirm
} from 'antd'
const STRINGS = {
  SUBTITLE_NEW: 'δημιουργία ιστότοπου',
  SUBTITLE_EDIT: 'επεξεργασία ιστότοπου',
  SAVE: 'Αποθήκευση',
  CANCEL: 'Ακύρωση',
  NEWPAGE: 'Νέα Σελίδα'
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
const SiteView = ({ site, onSave, onCancel, onBack, siteHandler }) => {
  const [page, setPage] = useState(null)
  if (!site) {
    return null
  }

  const siteUpdateHandler = event => {
    site = ({ ...site, [event.target.name]: event.target.value })
    siteHandler(site)
  }
  const categoryHandler = value => {
    site = ({ ...site, category: value })
    siteHandler(site)
  }

  const removePage = index => {
    site.pages.splice(index, 1)
    siteHandler(site)
  }

  const newPage = () => {
    setPage({ title: 'New Site', url: '' })
  }

  const IconText = ({ type, text, index }) => (
    <AntdPopconfirm
      title="Αφαίρεση σελίδας ?"
      onConfirm={() => removePage(index)}
      onCancel={null}
      okText="Ναι"
      cancelText="Όχι">
      <span style={{ color: 'white' }}>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span></AntdPopconfirm>
  );
  return (
    <div>
      <PageHeader
        title={site.title}
        subtitle={site.id ? STRINGS.SUBTITLE_EDIT : STRINGS.SUBTITLE_NEW}
        onBack={onBack}
        actions={[
          {
            caption: STRINGS.CANCEL,
            onClick: onCancel
          },
          {
            caption: STRINGS.NEWPAGE,
            onClick: newPage
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
            <Form.Item label="Όνομα"  >
              <Input
                prefix={<Icon type="user" />}
                name="name"
                value={site.name}
                onChange={siteUpdateHandler}
              />
            </Form.Item>
            <Form.Item label="Encoding" >
              <Input
                prefix={<Icon type="file-unknown" />}
                name="encodingCode"
                value={site.encodingCode}
                onChange={siteUpdateHandler}
              />
            </Form.Item>
            <Form.Item label="Latitude" >
              <Input
                prefix={<Icon type="environment" />}
                name="latitude"
                value={site.latitude}
                onChange={siteUpdateHandler}
              />
            </Form.Item>
            <Form.Item label="Longitude" >
              <Input
                prefix={<Icon type="environment" />}
                name="longitude"
                value={site.longitude}
                onChange={siteUpdateHandler}
              />
            </Form.Item>
            <Form.Item label="Κατηγορία">
              <Select
                value={site.category} onChange={categoryHandler}>
                <Select.Option value="Δήμοι">Δήμοι</Select.Option>
                <Select.Option value="katiallo">katiallo</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Σελίδες">
              <List
                itemLayout="vertical"
                bordered={true}
                size="small"
                dataSource={site.pages}
                renderItem={(item, i) => (
                  <List.Item
                    key={item.title}
                    actions={[
                      <IconText type="delete" text="διαγραφη" index={i} />,
                      <IconText type="edit" text="επεξεργασία" />,
                    ]}
                  >
                    <List.Item.Meta
                      title={<a target="blank" href={item.uri}>{item.title}</a>}
                      description={item.exceptions.map((ex, i) => (
                        <div key={i} style={{ color: 'white' }}>{i + 1}. {ex.type} / {ex.attribute} / {ex.value}</div>
                      ))}
                    />
                  </List.Item>
                )}
              />

            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

const Site = () => (
  <SiteContainer>
    <SiteView />
  </SiteContainer>
)

export default Site
