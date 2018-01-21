import { config } from '../config';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import async from 'async';
import qs from 'qs';
import _ from 'lodash';
import { Tag, Divider, Button, Modal, Spin } from 'antd';
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
      exits: [],
      redirectUrl: '',
      loading: true
    };
  }

  componentDidMount() {
    this.getMove(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.getMove(nextProps.match.params.id);
  }

  getMove = id => {
    axios.get(config.API_URL + 'moves/' + id)
      .then((response) => {
        async.parallel({
          childMoves: callback => {
            this.getChildMoves(id, callback);
          },
          entries: callback => {
            if (['freeze', 'powermove', 'position'].includes(response.data.type)) {
              this.getEntries(id, callback);
            } else {
              callback(null, []);
            };
          },
          exits: callback => {
            if (['freeze', 'powermove', 'position'].includes(response.data.type)) {
              this.getExits(id, callback);
            } else {
              callback(null, []);
            };
          }
        },
        (err, results) => {
          this.setState({
            move: response.data,
            childMoves: results.childMoves,
            entries: results.entries,
            exits: results.exits,
            loading: false
          })
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getChildMoves = (id, callback) => {
    axios.post(config.API_URL + 'moves/filter', qs.stringify({
      parentMove: id
    }))
      .then((response) => {
        callback(null, response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getEntries = (id, callback) => {
    axios.post(config.API_URL + 'moves/filter', qs.stringify({
      endingPositions: JSON.stringify([id])
    }))
      .then((response) => {
        callback(null, response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getExits = (id, callback) => {
    axios.post(config.API_URL + 'moves/filter', qs.stringify({
      startingPositions: JSON.stringify([id])
    }))
      .then((response) => {
        callback(null, response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  editMove = () => {
    this.setState({redirectUrl: '/moves/edit/' + this.state.move._id});
  }

  confirmDelete = () => {
    Modal.confirm({
      title: 'Confirm delete',
      content: 'Are you sure to delete "' + this.state.move.name + '"?',
      onOk: () => {
        this.deleteMove();
      },
      onCancel() {},
    });
  }

  deleteMove = () => {
    axios.delete(config.API_URL + 'moves/' + this.state.move._id)
      .then((response) => {
        this.setState({redirectUrl: '/'});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div className="align-center">
            <div className="vertical-spacer" />
            <div className="vertical-spacer" />
            <Spin />
            <br/>Loading...
          </div>
        ) : (
          <div>
            {this.state.redirectUrl ? <Redirect push to={this.state.redirectUrl} /> : null}
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
            <div className="align-right">
              <Button type="dashed" size="small" onClick={this.editMove}>Edit</Button>
              &nbsp;
              <Button type="danger" size="small" onClick={this.confirmDelete}>Delete</Button>
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
        )}
      </div>
    );
  }
}

export default Move;
