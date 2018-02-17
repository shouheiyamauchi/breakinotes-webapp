import { API_URL } from 'helpers/config';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import async from 'async';
import qs from 'qs';
import _ from 'lodash';
import { Tag, Divider, Button, Modal, Spin } from 'antd';
import MoveTypeAvatar from '../../components/MoveTypeAvatar';
import MoveTag from '../../components/MoveTag';
import MoveTags from '../../components/MoveTags';
import MultimediaTags from '../../components/MultimediaTags';

class MoveFrame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moveFrame: {
        name: '',
        origin: '',
        type: '',
        notes: '',
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
    this.getMoveFrame(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.getMoveFrame(nextProps.match.params.id);
  }

  getMoveFrame = id => {
    axios.get(API_URL + 'moveFrames/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        async.parallel({
          childMoves: callback => {
            this.getChildMoveFrames(id, callback);
          },
          entries: callback => {
            this.getEntries(id, callback);
          },
          exits: callback => {
            this.getExits(id, callback);
          }
        },
        (err, results) => {
          this.setState({
            moveFrame: response.data,
            childMoves: results.childMoves,
            entries: results.entries,
            exits: results.exits,
            loading: false
          })
        });
      })
      .catch((error) => {
        this.props.removeAuthToken();
      })
  }

  getChildMoveFrames = (id, callback) => {
    axios.post(API_URL + 'moveFrames/filter', qs.stringify({
      parentMove: id
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        callback(null, response.data);
      })
      .catch((error) => {
        this.props.removeAuthToken();
      })
  }

  getEntries = (id, callback) => {
    axios.post(API_URL + 'moves/filter', qs.stringify({
      endingPositions: JSON.stringify([id])
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        callback(null, response.data);
      })
      .catch((error) => {
        this.props.removeAuthToken();
      })
  }

  getExits = (id, callback) => {
    axios.post(API_URL + 'moves/filter', qs.stringify({
      startingPositions: JSON.stringify([id])
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        callback(null, response.data);
      })
      .catch((error) => {
        this.props.removeAuthToken();
      })
  }

  editMoveFrame = () => {
    this.setState({redirectUrl: '/moveFrames/edit/' + this.state.moveFrame._id});
  }

  confirmDelete = () => {
    Modal.confirm({
      title: 'Confirm delete',
      content: 'Are you sure to delete "' + this.state.moveFrame.name + '"?',
      onOk: () => {
        this.deleteMoveFrame();
      },
      onCancel() {},
    });
  }

  deleteMoveFrame = () => {
    axios.delete(API_URL + 'moveFrames/' + this.state.moveFrame._id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({redirectUrl: '/moveFrames'});
      })
      .catch((error) => {
        this.props.removeAuthToken();
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
              <MoveTypeAvatar move={this.state.moveFrame} />
              <div className="horizontal-spacer" />
              <div style={{lineHeight:"125%"}}>
                <span className="title">{this.state.moveFrame.name}</span>
                <br />
                <span>{_.capitalize(this.state.moveFrame.origin)} {_.capitalize(this.state.moveFrame.type)}</span>
              </div>
            </div>
            <div className="vertical-spacer" />
            <div className="align-right">
              <Button type="dashed" size="small" onClick={this.editMoveFrame}>Edit</Button>
              &nbsp;
              <Button type="danger" size="small" onClick={this.confirmDelete}>Delete</Button>
            </div>
            <div className="vertical-spacer" />
            <Divider />
            <div className="vertical-spacer" />
            <div>
              <div>
                <h3>Entries</h3>
                {this.state.entries.length === 0 ? <Tag>None</Tag> : <MoveTags type="moves" moves={this.state.entries} />}
              </div>
              <Divider />
              <div>
                <h3>Exits</h3>
                {this.state.exits.length === 0 ? <Tag>None</Tag> : <MoveTags type="moves" moves={this.state.exits} />}
              </div>
            </div>
            <Divider />
            <div>
              <h3>Parent Move</h3>
              {!this.state.moveFrame.parentMove ? <Tag>None</Tag> : <MoveTag type="moveFrames" move={this.state.moveFrame.parentMove} /> }
            </div>
            <Divider />
            <div>
              <h3>Child Moves</h3>
              {this.state.childMoves.length === 0 ? <Tag>None</Tag> : <MoveTags type="moveFrames" moves={this.state.childMoves} />}
            </div>
            <Divider />
            <div>
              <h3>Multimedia</h3>
              {this.state.moveFrame.multimedia.length === 0 ? <Tag>None</Tag> : <MultimediaTags multimedia={this.state.moveFrame.multimedia} />}
            </div>
            <Divider />
            <div>
              <h3>Notes</h3>
              {!this.state.moveFrame.notes ? 'None' : this.state.moveFrame.notes}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MoveFrame;
