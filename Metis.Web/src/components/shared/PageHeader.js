import React from 'react'
import { PageHeader as AntdPageHeader, Button as AntdButton } from 'antd'
import './shared.less'

const PageHeader = ({ title, subtitle, onBack, actions }) => {
  return (
    <AntdPageHeader
      title={title}
      subTitle={subtitle}
      onBack={onBack}
      extra={actions.map((action, idx) => (
        <AntdButton
          key={idx}
          type="ghost"
          size="small"
          onClick={action.onClick}>
          {action.caption}
        </AntdButton>
      ))}
      className="metis-page-header"
    />
  )
}

export default PageHeader
