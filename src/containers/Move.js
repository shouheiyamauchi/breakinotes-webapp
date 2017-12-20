import { config } from '../config'
import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash'
import { Avatar, Divider, Tag, Card } from 'antd';

class Move extends Component {
  constructor(props) {
    super(props);

    this.state = {
      move: this.props.location.state.move,
      startingPosition: {},
      endingPositiongs: []
    }

    this.getMove = this.getMove.bind(this);
  }

  componentDidMount() {
    this.getMove(this.state.move.startingPosition);
  }

  getMove(id) {
    axios.get(config.API_URL + 'moves/' + id)
      .then((response) => {
        console.log(config.API_URL + 'moves/' + id)
        this.setState({startingPosition: response.data});
      })
      .catch((error) => {
        console.log(config.API_URL + 'moves/' + id)
        console.log(error);
      })
  }

  generateMoveTag(move) {

  }

  render() {
    return (
      <div>
        <div className="vertical-align">
          <Avatar size="large" style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>T</Avatar>
          <div className="horizontal-spacer" />
          <div style={{lineHeight:"125%"}}>
            <span className="title">{this.state.move.name}</span>
            <br />
            <span>{_.capitalize(this.state.move.origin)} {_.capitalize(this.state.move.type)}</span>
          </div>
        </div>
        <Divider />
        <Card title="Starting Position">
          {this.state.startingPosition === {} ? null : <Tag color="blue">{this.state.startingPosition.name}</Tag>}
        </Card>
        <div className="vertical-spacer" />
        <Card title="Ending Positions">
          {this.state.startingPosition === {} ? null : <Tag color="blue">{this.state.startingPosition.name}</Tag>}
        </Card>
      </div>
    );
  }
}

export default Move;
