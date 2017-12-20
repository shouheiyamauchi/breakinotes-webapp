import { config } from '../config'
import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import MovesListItem from '../components/MovesListItem';

class MovesList extends Component {
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

    return (
      <div>
        <Button onClick={this.getMoves}>Get Moves</Button>
        <Button onClick={this.resetMoves}>Reset</Button>
        {movesList}
      </div>
    );
  }
}

export default MovesList;
