import React from 'react'
import { Tag } from 'antd'
import storage from './storage'
export const calculateStatus = date => {
  const _d = new Date(date)
  const d = new Date()
  return _d.getTime() > d.getTime() ? (
    <Tag color="#40861d">Ενεργό</Tag>
  ) : (
      <Tag color="red">Ανενεργό</Tag>
    )
}

export const getCurrentMember = () => {
  const user = storage.get('auth')
  return user
    ? { userId: user.userid, email: user.email, name: user.title }
    : null
}

export const priority = {
  0: <Tag color="#40861d">Normal</Tag>,
  1: <Tag color="#2db7f5">Low</Tag>,
  2: <Tag color="red">High</Tag>,
  3: <Tag color="volcano">Urgent</Tag>
}


