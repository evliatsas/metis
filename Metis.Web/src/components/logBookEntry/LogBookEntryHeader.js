import React from 'react'
import { PageHeader as AntdPageHeader, Button as AntdButton } from 'antd'
import './logBookEntry.less'

const STRINGS = {
  SUBTITLE: 'Συμβάν βιβλίου καταγραφής',
  CANCEL: 'Άκυρο',
  SAVE: 'Αποθήκευση',
  DELETE: 'Διαγραφή'
}

const LogBookEntryHeader = ({
  logBookEntry,
  onBack,
  onSave,
  onCancel,
  onDelete
}) => {
  return (
    <AntdPageHeader
      title={logBookEntry.name}
      subTitle={STRINGS.SUBTITLE}
      onBack={() => onBack()}
      className="logbook-header"
      extra={[
        <AntdButton key="2" type="ghost" size="small" onClick={onCancel}>
          {STRINGS.CANCEL}
        </AntdButton>,
        <AntdButton key="1" type="ghost" size="small" onClick={onSave}>
          {STRINGS.SAVE}
        </AntdButton>
      ]}
    />
  )
}

export default LogBookEntryHeader
