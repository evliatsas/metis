import React from 'react'
import { Tag as AntdTag } from 'antd'

const STRINGS = {
  OPEN: 'Ενεργό',
  CLOSED: 'Ανενεργό'
}

const LogBookStatus = ({ closeDate }) => {
  const isClosed = new Date(closeDate) < new Date()

  return isClosed ? (
    <AntdTag color="#f50">{STRINGS.CLOSED}</AntdTag>
  ) : (
    <AntdTag color="#40861d">{STRINGS.OPEN}</AntdTag>
  )
}

export default LogBookStatus
