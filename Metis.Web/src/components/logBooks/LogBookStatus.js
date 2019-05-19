import React from 'react'
import { Tag as AntdTag } from 'antd'

const STRINGS = {
  OPEN: 'Ενεργό',
  CLOSED: 'Ανενεργό'
}

const LogBookStatus = ({ closeDate }) => {
  const isClosed = new Date(closeDate) < new Date()

  return isClosed ? (
    <AntdTag color="#cf1322">{STRINGS.CLOSED}</AntdTag>
  ) : (
    <AntdTag color="#378212">{STRINGS.OPEN}</AntdTag>
  )
}

export default LogBookStatus
