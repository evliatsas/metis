import React from 'react'
import { PageHeader as AntdPageHeader, Button as AntdButton } from 'antd'
import './logBook.less'

const STRINGS = {
  EDIT: 'Επεξεργασία',
  CREATE: 'Νέο Συμβάν'
}

const LogBookHeader = ({ logBook, onBack, onEdit, onCreate }) => {
  return (
    <AntdPageHeader
      title={logBook.name}
      subTitle={logBook.owner.name}
      onBack={() => onBack()}
      className="logbook-header"
      extra={[
        [
          <AntdButton
            key="1"
            className="has-text-primary"
            size="small"
            onClick={onEdit}>
            {STRINGS.EDIT}
          </AntdButton>,
          <AntdButton key="2" type="primary" size="small" onClick={onCreate}>
            {STRINGS.CREATE}
          </AntdButton>
        ]
      ]}
    />
  )
}

export default LogBookHeader
