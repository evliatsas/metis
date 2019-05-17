import React from 'react'
import { PageHeader as AntdPageHeader, Button as AntdButton } from 'antd'
import './logBooks.css'

const STRINGS = {
  NEW: 'Προσθήκη Νέου'
}

const LogBookHeader = ({ logBook, onBack, onCreate }) => {
  return (
    <AntdPageHeader
      title={logBook.name}
      subTitle={logBook.owner.name}
      onBack={() => onBack()}
      extra={
        <AntdButton key="1" type="primary" size="small" onClick={onCreate}>
          {STRINGS.NEW}
        </AntdButton>
      }
      className="logbooks-header"
    />
  )
}

export default LogBookHeader
