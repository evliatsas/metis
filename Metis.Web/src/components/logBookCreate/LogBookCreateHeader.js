import React from 'react'
import { PageHeader as AntdPageHeader, Button as AntdButton } from 'antd'
import './logBookCreate.less'

const STRINGS = {
  SUBTITLE: 'Δημιουργία Βιβλίου Συμβάντων',
  SAVE: 'Αποθήκευση',
  CANCEL: 'Ακύρωση'
}

const LogBookCreateHeader = ({ logBook, onBack, onSave, onCancel }) => {
  return (
    <AntdPageHeader
      title={logBook.name}
      subTitle={STRINGS.SUBTITLE}
      onBack={() => onBack()}
      className="logbook-header"
      extra={[
        [
          <AntdButton key="2" type="ghost"  size="small" onClick={onCancel}>
            {STRINGS.CANCEL}
          </AntdButton>,
          <AntdButton key="1" type="ghost" size="small" onClick={onSave}>
            {STRINGS.SAVE}
          </AntdButton>
        ]
      ]}
    />
  )
}

export default LogBookCreateHeader
