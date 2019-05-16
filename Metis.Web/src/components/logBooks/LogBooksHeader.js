import React from 'react'
import { PageHeader as AntdPageHeader, Button as AntdButton } from 'antd'
import './logBooks.css'

const STRINGS = {
  TITLE: 'Συμβάντα',
  SUBTITLE: 'Σύντομη ανασκόπηση συμβάντων ταξινομημένα κατα ημερομηνία',
  REFRESH: 'Ανανέωση',
  NEW: 'Προσθήκη Νέου'
}

const LogBooksHeader = ({ onBack, onCreate }) => {
  return (
    <AntdPageHeader
      title={STRINGS.TITLE}
      subTitle={STRINGS.SUBTITLE}
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

export default LogBooksHeader
