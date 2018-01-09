import { config } from '../config';
import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import _ from 'lodash';
import { Tag, Divider } from 'antd';
import MoveTypeAvatar from '../components/MoveTypeAvatar';
import MoveTag from '../components/MoveTag';
import MoveTags from '../components/MoveTags';
import MultimediaTags from '../components/MultimediaTags';

class Move extends Component {
  constructor(props) {
    super(props);

    this.state = {
      move: {
        name: '',
        origin: '',
        type: '',
        notes: '',
        startingPositions: [],
        endingPositions: [],
        parentMove: '',
        multimedia: []
      },
      childMoves: [],
      entries: [],
      exits: []
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
        if (['freeze', 'powermove', 'position'].includes(response.data.type)) this.getEntriesAndExits(id);
        this.getChildMoves(id);
        this.setState({move: response.data});
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getChildMoves = id => {
    axios.post(config.API_URL + 'moves/filter', qs.stringify({
      parentMove: id
    }))
      .then((response) => {
        this.setState({childMoves: response.data});
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getEntriesAndExits = id => {
    axios.post(config.API_URL + 'moves/filter', qs.stringify({
      endingPositions: JSON.stringify([id])
    }))
      .then((response) => {
        this.setState({entries: response.data});
      })
      .catch((error) => {
        console.log(error);
      })

    axios.post(config.API_URL + 'moves/filter', qs.stringify({
      startingPositions: JSON.stringify([id])
    }))
      .then((response) => {
        this.setState({exits: response.data});
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {
    return (
      <div>
        <div className="vertical-align">
          <MoveTypeAvatar move={this.state.move} />
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
        {!this.state.move.type ?
          null :
          (
            ['freeze', 'powermove', 'position'].includes(this.state.move.type) ?
              (
                <div>
                  <div>
                    <h3>Entries</h3>
                    {this.state.entries.length === 0 ? <Tag>None</Tag> : <MoveTags moves={this.state.entries} />}
                  </div>
                  <Divider />
                  <div>
                    <h3>Exits</h3>
                    {this.state.exits.length === 0 ? <Tag>None</Tag> : <MoveTags moves={this.state.exits} />}
                  </div>
                </div>
              ) :
              (
                <div>
                  <div>
                    <h3>Starting Position</h3>
                    {this.state.move.startingPositions.length === 0 ? <Tag>None</Tag> : <MoveTags moves={this.state.move.startingPositions} />}
                  </div>
                  <Divider />
                  <div>
                    <h3>Ending Positions</h3>
                    {this.state.move.endingPositions.length === 0 ? <Tag>None</Tag> : <MoveTags moves={this.state.move.endingPositions} />}
                  </div>
                </div>
              )
          )
        }
        <Divider />
        <div>
          <h3>Parent Move</h3>
          {!this.state.move.parentMove ? <Tag>None</Tag> : <MoveTag move={this.state.move.parentMove} /> }
        </div>
        <Divider />
        <div>
          <h3>Child Moves</h3>
          {this.state.childMoves.length === 0 ? <Tag>None</Tag> : <MoveTags moves={this.state.childMoves} />}
        </div>
        <Divider />
        <div>
          <h3>Multimedia</h3>
          {this.state.move.multimedia.length === 0 ? <Tag>None</Tag> : <MultimediaTags multimedia={this.state.move.multimedia} />}
        </div>
        <Divider />
        <div>
          <h3>Notes</h3>
          {!this.state.move.notes ? 'None' : this.state.move.notes}
        </div>
      </div>
    );
  }
}

export default Move;
