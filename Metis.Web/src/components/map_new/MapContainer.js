import React from 'react'
import Map from './Map'
import api from '../../services/api'

class MapContainer extends React.Component {
  state = {
    sites: [],
    messages: [],
    selected: null
  }

  componentDidMount() {
    api
      .get('/api/sites')
      .then(sites => {
        this.setState({ sites })
      })
      .catch(err => {
        this.setState({ sites: [] })
      })
  }

  render() {
    const { sites } = this.state
    return (
      <div style={{ height: '100%' }}>
        <Map sites={sites} zoom={9} style={{ height: '100%' }} />
      </div>
    )
  }
}

export default MapContainer
