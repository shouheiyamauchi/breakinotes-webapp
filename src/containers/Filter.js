import { config } from '../config'
import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import MovesList from './MovesList.js'

class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moves:[],
      redirectUrl: '',
      name: '',
      origin: '',
      type: '',
      notes: '',
      startingPosition: '',
      endingPositions: [],
      parentMove: '',
      childMoves: []
    };
  }

  componentDidMount() {
    const urlParams = qs.parse(this.props.location.search.substr(1));
    this.setState({
      name: urlParams.name,
      origin: urlParams.origin,
      type: urlParams.type,
      notes: urlParams.notes,
      startingPosition: urlParams.startingPosition,
      endingPositions: urlParams.endingPositions,
      parentMove: urlParams.parentMove,
      childMoves: urlParams.childMoves
    }, () => {
      this.getMoves();
    });
  }

  getMoves = () => {
    axios.post(config.API_URL + 'moves/filter', qs.stringify({
      name: this.state.name,
      origin: this.state.origin,
      type: this.state.type,
      notes: this.state.notes,
      startingPosition: this.state.startingPosition,
      endingPositions: JSON.stringify(this.state.endingPositions),
      parentMove: this.state.parentMove,
      childMoves: JSON.stringify(this.state.childMoves)
    }))
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

  handleInputChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name]: value});

    window.history.pushState('', '', '/filter?' + value);
  }

  render() {
    return (
      <div>
        <input name='redirectUrl' value={this.state.redirectUrl} onChange={this.handleInputChange} />
        <MovesList moves={this.state.moves} deleteMove={this.deleteMove} />
      </div>
    );
  }
}

export default Filter;
