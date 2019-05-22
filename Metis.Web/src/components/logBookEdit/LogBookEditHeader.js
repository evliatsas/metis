import React from 'react'
import { PageHeader as AntdPageHeader, Button as AntdButton } from 'antd'
import './logBookEdit.less'

const STRINGS = {
  SUBTITLE: 'Επεξεργασία Βιβλίου Συμβάντων',
  SAVE: 'Αποθήκευση',
  CANCEL: 'Ακύρωση'
}

const LogBookEditHeader = ({ logBook, onBack, onSave, onCancel }) => {
  return (
    <AntdPageHeader
      title={logBook.name}
      subTitle={STRINGS.SUBTITLE}
      onBack={() => onBack()}
      className="logbook-header"
      extra={[
        [
          <AntdButton key="2" type="danger" size="small" onClick={onCancel}>
            {STRINGS.CANCEL}
          </AntdButton>,
          <AntdButton key="1" type="primary" size="small" onClick={onSave}>
            {STRINGS.SAVE}
          </AntdButton>
        ]
      ]}
    />
  )
}

export default LogBookEditHeader
