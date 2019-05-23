import React from 'react'
import {
  Button as AntdButton, PageHeader as AntdPageHeader, Popconfirm
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
      extra={
        [<Popconfirm
          key="0"
          title="Θέλετε σίγουρα να διαγράψετε το logBook?"
          onConfirm={onDelete}
          onCancel={null}
          okText="Ναι"
          cancelText="Όχι">
          <AntdButton type="danger" size="small">
            {STRINGS.DELETE}
          </AntdButton>
        </Popconfirm>
          ,
        <AntdButton key="2" type="danger" size="small" onClick={onCancel}>
          {STRINGS.CANCEL}
        </AntdButton>,
        <AntdButton key="1" type="primary" size="small" onClick={onSave}>
          {STRINGS.SAVE}
        </AntdButton>
        ]
      }
    />
  )
}

export default LogBookEditHeader
