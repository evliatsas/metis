import React from 'react'
import { Card as AntdCard, Icon } from 'antd'

const LogBookCard = ({ logBook }) => {
  return (
    <AntdCard
      className="logbook-card"
      actions={[
        <Icon type="setting" />,
        <Icon type="edit" />,
        <Icon type="ellipsis" />
      ]}>
      <AntdCard.Meta title={logBook.name} description={logBook.owner.name} />
      <div>{JSON.stringify(logBook)}</div>
    </AntdCard>
  )
}

export default LogBookCard
