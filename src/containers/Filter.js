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
      redirectUrl: ''
    };
  }

  componentDidMount() {
    const urlParams = qs.parse(this.props.location.search.substr(1))
    this.getMoves(urlParams);
  }

  getMoves = params => {
    axios.post(config.API_URL + 'moves/filter', qs.stringify({
      name: params.name,
      origin: params.origin,
      type: params.type,
      notes: params.notes,
      startingPosition: params.startingPosition,
      endingPositions: JSON.stringify(params.endingPositions),
      parentMove: params.parentMove,
      childMoves: JSON.stringify(params.childMoves)
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
