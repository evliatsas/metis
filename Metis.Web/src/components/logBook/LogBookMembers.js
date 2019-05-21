import React from 'react'
import { Collapse, Icon } from 'antd'

const STRINGS = {
  HEADER: 'Μέλη'
}

const ConnectedMember = ({ member }) => (
  <div style={{ display: 'flex', color: 'green', fontWeight: 'bolder' }}>
    <span style={{ flexGrow: 1 }}>{member.name}</span>
    <Icon type="wifi" />
  </div>
)

const DisconectedMember = ({ member }) => (
  <div>
    <span>{member.name}</span>
  </div>
)

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
      {members.map((m, idx) =>
        m.online ? (
          <ConnectedMember key={idx} member={m} />
        ) : (
          <DisconectedMember key={idx} member={m} />
        )
      )}
    </Collapse.Panel>
  </Collapse>
)

export default LogBookMembers
