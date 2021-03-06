import { API_URL } from 'helpers/config'
import React, { Component } from 'react'
import { Divider } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { withMovesContext } from '../../../../contexts/MovesContext'
import MoveSetsList from './components/MoveSetsList'

class MoveSets extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    this.getMoveSets()
  }

  getMoveSets = () => {
    this.setState({ loading: true }, () => {
      axios.post(API_URL + 'moveSets/filter', qs.stringify({

      }), {
        headers: {
          Authorization: 'JWT ' + localStorage.getItem('breakinotes')
        }
      })
        .then((response) => {
          this.props.setMoveSets(response.data)
          this.setState({ loading: false })
        })
        .catch((error) => {
          this.props.removeAuthToken()
        })
    })

  }

  deleteMove = id => {
    axios.delete(API_URL + 'moveSets/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.getMoveSets()
        return
      })
      .catch((error) => {
        this.props.removeAuthToken()
      })
  }

  render() {
    return (
      <div>
        <span className="title">Move Sets List</span>
        <Divider />
        <MoveSetsList moveSets={this.props.moveSets} deleteMove={this.deleteMove} loading={false} />
      </div>
    )
  }
}

export default withMovesContext(MoveSets)
