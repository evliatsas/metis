import React from 'react'
import {
  Button as AntdButton, PageHeader as AntdPageHeader
} from 'antd'
import './logBookEdit.less'

const STRINGS = {
  SUBTITLE: 'Επεξεργασία Βιβλίου Συμβάντων',
  SAVE: 'Αποθήκευση',
  CANCEL: 'Ακύρωση',
  DELETE: 'Διαγραφή'
}

const LogBookEditHeader = ({ logBook, onBack, onSave, onCancel, onDelete }) => {

  return (
    <AntdPageHeader
      title={logBook.name}
      subTitle={STRINGS.SUBTITLE}
      onBack={() => onBack()}
      className="logbook-header"
      extra={[
        [
          <AntdButton key="0" type="danger" size="small" onClick={onDelete}>
            {STRINGS.DELETE}
          </AntdButton>,
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
