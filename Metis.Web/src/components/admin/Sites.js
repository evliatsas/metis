import React from 'react'
import {
  Tooltip as AntdTooltip,
  Button as AntdButton,
  Popconfirm as AntdPopconfirm,
  Tag as AntdTag
} from 'antd'
import SitesContainer from '../containers/admin/SitesContainer'
import PageHeader from '../shared/PageHeader'
import Table from '../shared/Table'
import { statusColor } from '../map/mapUtilities'

const STRINGS = {
  TITLE: 'Ιστότοποι',
  SUBTITLE: 'διαχείριση ιστότοπων εφαρμογής',
  NEW: 'Νέος Ιστότοπος',
  EDIT: 'Επεξεργασία',
  DELETE: 'Διαγραφή',
  DELETE_CONFIRMATION:
    'Είστε σίγουρος ότι επιθυμείτε να διαγράψετε τον επιλεγμένο ιστότοπο;'
}

const columns = [
  {
    title: 'Όνομα',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Κατηγορία',
    dataIndex: 'category',
    key: 'category'
  },
  {
    title: 'Ιστοσελίδες',
    dataIndex: 'sites',
    key: 'sites',
    render: (e, row) => (
      <div>
        {row.pages.map(p => (
          <AntdTag
            key={p.uri}
            color={Object.values(statusColor)[p.status]}
            style={{ marginTop: '5px' }}>
            <a target="_window" href={p.uri}>
              {p.uri}
            </a>
          </AntdTag>
        ))}
      </div>
    )
  }
]

const SitesView = ({ sites, onCreate, onEdit, onDelete }) => {
  const headers = [
    ...columns,
    {
      title: 'Ενέργειες',
      key: 'action',
      render: (e, row) => (
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
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
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <Table
            columns={headers}
            data={sites}
            style={{ maxWidth: '1024px' }}
          />
        </div>
      </div>
    </div>
  )
}

const Sites = () => (
  <SitesContainer>
    <SitesView />
  </SitesContainer>
)

export default Sites
