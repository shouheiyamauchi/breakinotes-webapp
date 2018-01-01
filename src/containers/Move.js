import { config } from '../config';
import { moveTypeColors, moveTypeShortNames } from '../constants'
import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Avatar, Divider } from 'antd';
import MoveTag from '../components/MoveTag';


class Move extends Component {
  constructor(props) {
    super(props);

    this.state = {
      move: {
        startingPosition: null,
        endingPositions: [],
        parentMove: null,
        childMoves: []
      }
    };
  }

  componentDidMount() {
    this.getMove(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    // update move when navigating from one to another
    this.getMove(nextProps.match.params.id);
  }

  getMove = id => {
    axios.get(config.API_URL + 'moves/' + id)
      .then((response) => {
        this.setState({move: response.data});
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {
    const endingPositions = this.state.move.endingPositions.map((move, index) => {
      return <MoveTag move={move} key={'endingPosition-' + index} />;
    })

    const childMoves = this.state.move.childMoves.map((move, index) => {
      return <MoveTag move={move} key={'childMoves-' + index} />;
    })

    return (
      <div>
        <div className="vertical-align">
          <Avatar size="large" style={{ backgroundColor: moveTypeColors[this.state.move.type] }}>{moveTypeShortNames[this.state.move.type]}</Avatar>
          <div className="horizontal-spacer" />
          <div style={{lineHeight:"125%"}}>
            <span className="title">{this.state.move.name}</span>
            <br />
            <span>{_.capitalize(this.state.move.origin)} {_.capitalize(this.state.move.type)}</span>
          </div>
        </div>
        <div className="vertical-spacer" />
        <Divider />
        <div className="vertical-spacer" />
        <div>
          <h3>Starting Position</h3>
          {(this.state.move.startingPosition === null) ? null : <MoveTag move={this.state.move.startingPosition} /> }
        </div>
        <div>
          <Divider />
          <h3>Ending Positions</h3>
          {endingPositions}
        </div>
        <Divider />
        <div>
          <h3>Parent Move</h3>
          {(this.state.move.parentMove === null) ? null : <MoveTag move={this.state.move.parentMove} /> }
        </div>
        <div>
          <Divider />
          <h3>Child Moves</h3>
          {childMoves}
        </div>
      </div>
    );
  }
}

export default Move;
