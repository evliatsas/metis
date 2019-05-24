import React from 'react'
import SiteContainer from '../containers/admin/SiteContainer'
import PageHeader from '../shared/PageHeader'
import { Select, Row, Form, Icon, Input, Col } from 'antd'
import Page from './Page'

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
    lg: { span: 6 },
    xl: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 12 },
    xl: { span: 11 }
  }
}
const SiteView = ({ site, onSave, onCancel, onBack, siteHandler }) => {
  if (!site) {
    return null
  }

  const siteUpdateHandler = event => {
    site = { ...site, [event.target.name]: event.target.value }
    siteHandler(site)
  }
  const categoryHandler = value => {
    site = { ...site, category: value }
    siteHandler(site)
  }

  const removePage = index => {
    site.pages.splice(index, 1)
    siteHandler(site)
  }

  const newPage = () => {
    site.pages.unshift({ title: 'New Site', url: '', exceptions: [] })
    siteHandler(site)
  }

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
            <Form.Item label="Όνομα">
              <Input
                prefix={<Icon type="user" />}
                name="name"
                value={site.name}
                onChange={siteUpdateHandler}
              />
            </Form.Item>
            <Form.Item label="Encoding">
              <Input
                prefix={<Icon type="file-unknown" />}
                name="encodingCode"
                value={site.encodingCode}
                onChange={siteUpdateHandler}
              />
            </Form.Item>
            <Form.Item label="Latitude">
              <Input
                prefix={<Icon type="environment" />}
                name="latitude"
                value={site.latitude}
                onChange={siteUpdateHandler}
              />
            </Form.Item>
            <Form.Item label="Longitude">
              <Input
                prefix={<Icon type="environment" />}
                name="longitude"
                value={site.longitude}
                onChange={siteUpdateHandler}
              />
            </Form.Item>
            <Form.Item label="Κατηγορία">
              <Select value={site.category} onChange={categoryHandler}>
                <Select.Option value="Δήμοι">Δήμοι</Select.Option>
                <Select.Option value="Περιφέρειες">Περιφέρειες</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Σελίδες">
              <Page
                site={site}
                removePage={removePage}
                siteHandler={siteHandler}
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
