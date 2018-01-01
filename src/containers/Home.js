import { config } from '../config'
import React, { Component } from 'react';
import axios from 'axios';
import MovesList from './MovesList.js'

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moves: []
    };
  }

  componentDidMount() {
    this.getMoves();
  }

  getMoves = () => {
    axios.get(config.API_URL + 'moves')
      .then((response) => {
        this.setState({moves: response.data});
      })
      .catch((error) => {
        console.log(error);
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
      <MovesList moves={this.state.moves} deleteMove={this.deleteMove} />
    );
  }
}

export default Home;
