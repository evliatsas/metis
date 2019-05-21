import React from 'react'
import { Collapse, Icon } from 'antd'

const STRINGS = {
  HEADER: 'Μέλη'
}

const LogBookMembers = ({ members }) => (
  <Collapse bordered={false}>
    <Collapse.Panel
      header={
        <div style={{ display: 'flex' }}>
          <span style={{ flexGrow: 1 }}>{STRINGS.HEADER}</span>
          <span>
            {`(${members.filter(x => x.online).length}/${members.length})`}
          </span>
        </div>
      }>
      {members.map((m, idx) => (
        <div key={idx} style={{ display: 'flex' }}>
          <span style={{ flexGrow: 1 }}>{m.name}</span>
          {m.online && <Icon style={{ color: 'lightgreen' }} type="wifi" />}
        </div>
      ))}
    </Collapse.Panel>
  </Collapse>
)

export default LogBookMembers
