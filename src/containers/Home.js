import { config } from '../config'
import React, { Component } from 'react';
import axios from 'axios';
import MovesList from './MovesList.js'

class Home extends Component {
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
      axios.get(config.API_URL + 'moves')
        .then((response) => {
          this.setState({
            moves: response.data,
            loading: false
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });

  }

  deleteMove = id => {
    axios.delete(config.API_URL + 'moves/' + id)
      .then((response) => {
        this.getMoves();
        return
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <MovesList moves={this.state.moves} deleteMove={this.deleteMove} loading={this.state.loading} />
    );
  }
}

export default Home;
