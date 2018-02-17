import { config } from '../config'
import React, { Component } from 'react';
import axios from 'axios';
import MovesList from './MovesList.js'

class Moves extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moves: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getMoves();
  }

  getMoves = () => {
    this.setState({loading: true}, () => {
      axios.get(config.API_URL + 'moves', {
        headers: {
          Authorization: 'JWT ' + localStorage.getItem('breakinotes')
        }
      })
        .then((response) => {
          this.setState({
            moves: response.data,
            loading: false
          });
        })
        .catch((error) => {
          this.props.removeAuthToken();
        });
    });

  }

  deleteMove = id => {
    axios.delete(config.API_URL + 'moves/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.getMoves();
        return
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  render() {
    return (
      <MovesList moves={this.state.moves} deleteMove={this.deleteMove} loading={this.state.loading} />
    );
  }
}

export default Moves;
