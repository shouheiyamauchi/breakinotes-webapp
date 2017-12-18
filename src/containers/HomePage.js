import { config } from '../config'
import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import MovesListItem from '../components/MovesListItem';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moves: [],
    };

    this.getMoves = this.getMoves.bind(this);
    this.resetMoves = this.resetMoves.bind(this);
  };

  getMoves() {
    axios.get(config.API_URL + 'moves')
      .then((response) => {
        this.setState({moves: response.data})
      })
      .catch((error) => {
        console.log(error);
      });
  }

  resetMoves() {
    this.setState({moves: []});
  }

  render() {
    const movesList = this.state.moves.map((move, i) => {
      return <MovesListItem key={i} move={move} />
    })

    const style = {
      margin: 20,
      padding: 20
    };

    return (
      <div>
        <Button onClick={this.getMoves}>Get Moves</Button>
        <Button onClick={this.resetMoves}>Reset</Button>
        {movesList}
      </div>
    );
  }
}

export default HomePage;
