import { API_URL } from 'helpers/config'
import React, { Component } from 'react'
import { Divider } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { withMovesContext } from '../../../../contexts/MovesContext'
import MoveFramesList from './components/MoveFramesList'

class MoveFrames extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    this.getMoveFrames()
  }

  getMoveFrames = () => {
    this.setState({loading: true}, () => {
      axios.post(API_URL + 'moveFrames/filter', qs.stringify({

      }), {
        headers: {
          Authorization: 'JWT ' + localStorage.getItem('breakinotes')
        }
      })
        .then((response) => {
          this.props.setFrames(response.data)
          this.setState({ loading: false })
        })
        .catch((error) => {
          this.props.removeAuthToken()
        })
    })

  }

  deleteMove = id => {
    axios.delete(API_URL + 'moveFrames/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.getMoveFrames()
        return
      })
      .catch((error) => {
        this.props.removeAuthToken()
      })
  }

  render() {
    return (
      <div>
        <span className="title">Frames List</span>
        <Divider />
        <MoveFramesList moveFrames={this.props.moveFrames} deleteMove={this.deleteMove} loading={false} />
      </div>
    )
  }
}

export default withMovesContext(MoveFrames)
