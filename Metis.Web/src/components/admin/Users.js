import React from 'react'
import {
  Tooltip as AntdTooltip,
  Button as AntdButton,
  Popconfirm as AntdPopconfirm,
  Tag as AntdTag
} from 'antd'
import UsersContainer from '../containers/admin/UsersContainer'
import PageHeader from '../shared/PageHeader'
import Table from '../shared/Table'
import { statusColor } from '../map/mapUtilities'

const STRINGS = {
  TITLE: 'Χρήστες',
  SUBTITLE: 'διαχείριση χρηστών εφαρμογής',
  NEW: 'Νέος Χρήστης',
  EDIT: 'Επεξεργασία',
  DELETE: 'Διαγραφή',
  DELETE_CONFIRMATION:
    'Είστε σίγουρος ότι επιθυμείτε να διαγράψετε τον επιλεγμένο χρήστη;'
}

const columns = [
  {
    title: 'Τίτλος',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Όνομα Χρήστη',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Ρόλος',
    dataIndex: 'role',
    key: 'role',
    render: r => ['Viewer', 'Manager', 'Administrator'][r]
  },
  {
    title: 'Ιστότοποι',
    dataIndex: 'sites',
    key: 'sites',
    render: (e, row) => (
      <div>
        {row.sites.map(s => (
          <AntdTooltip key={s.id} title={s.pages[0].uri}>
            <AntdTag color={statusColor[s.status]} style={{ marginTop: '5px' }}>
              <a target="_window" href={s.pages[0].uri}>
                {s.name}
              </a>
            </AntdTag>
          </AntdTooltip>
        ))}
      </div>
    )
  }
]

const UsersView = ({ users, onCreate, onEdit, onDelete }) => {
  const headers = [
    ...columns,
    {
      title: 'Ενέργειες',
      key: 'action',
      render: (e, row) => (
        <div className="metis-table-actions">
          <AntdTooltip title={STRINGS.EDIT}>
            <AntdButton
              size="small"
              type="ghost"
              shape="circle"
              icon="form"
              onClick={() => onEdit(row)}
            />
          </AntdTooltip>
          <AntdPopconfirm
            title={STRINGS.DELETE_CONFIRMATION}
            onConfirm={() => onDelete(row)}
            onCancel={null}
            okText="Ναι"
            cancelText="Όχι">
            <AntdTooltip title={STRINGS.DELETE}>
              <AntdButton
                className="metis-table-delete-button"
                size="small"
                type="ghost"
                shape="circle"
                icon="delete"
              />
            </AntdTooltip>
          </AntdPopconfirm>
        </div>
      )
    }
  ]
  return (
    <div>
      <PageHeader
        title={STRINGS.TITLE}
        subtitle={STRINGS.SUBTITLE}
        actions={[
          {
            caption: STRINGS.NEW,
            onClick: onCreate
          }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Table columns={headers} data={users} />
      </div>
    </div>
  )
}

const Users = () => (
  <UsersContainer>
    <UsersView />
  </UsersContainer>
)

export default Users
