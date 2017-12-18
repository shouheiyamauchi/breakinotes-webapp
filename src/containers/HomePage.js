import { config } from '../config'
import React, { Component } from 'react';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import { List } from 'material-ui/List';
import Paper from 'material-ui/Paper';
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
        <Paper style={style} zDepth={1}>
          <RaisedButton label="Get Moves" onClick={this.getMoves} />
          <RaisedButton label="Reset" onClick={this.resetMoves} />
          <List>
            {movesList}
          </List>
        </Paper>
      </div>
    );
  }
}

export default HomePage;
