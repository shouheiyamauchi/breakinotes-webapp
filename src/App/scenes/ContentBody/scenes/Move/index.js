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
        childMoves: [],
        multimedia: []
      },
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
    axios.get(API_URL + 'moves/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({
          move: response.data,
          loading: false
        });
      })
      .catch((error) => {
        this.props.removeAuthToken();
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
    axios.delete(API_URL + 'moves/' + this.state.move._id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({redirectUrl: '/'});
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
            <div>
              <div>
                <h3>Starting Position</h3>
                {this.state.move.startingPositions.length === 0 ? <Tag>None</Tag> : <MoveTags type="moveFrames" moves={this.state.move.startingPositions} />}
              </div>
              <Divider />
              <div>
                <h3>Ending Positions</h3>
                {this.state.move.endingPositions.length === 0 ? <Tag>None</Tag> : <MoveTags type="moveFrames" moves={this.state.move.endingPositions} />}
              </div>
            </div>
            <Divider />
            <div>
              <h3>Parent Move</h3>
              {!this.state.move.parentMove ? <Tag>None</Tag> : <MoveTag type="moves" move={this.state.move.parentMove} /> }
            </div>
            <Divider />
            <div>
              <h3>Child Moves</h3>
              {this.state.move.childMoves.length === 0 ? <Tag>None</Tag> : <MoveTags type="moves" moves={this.state.move.childMoves} />}
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
