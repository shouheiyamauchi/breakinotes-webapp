import { API_URL } from 'helpers/config';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
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
        childMoves: [],
        entries: [],
        exits: [],
        multimedia: []
      },
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
        this.setState({
          moveFrame: response.data,
          loading: false
        });
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
                {!this.state.moveFrame.entries.length ? <Tag>None</Tag> : <MoveTags type="moves" moves={this.state.moveFrame.entries} />}
              </div>
              <Divider />
              <div>
                <h3>Exits</h3>
                {!this.state.moveFrame.exits.length ? <Tag>None</Tag> : <MoveTags type="moves" moves={this.state.moveFrame.exits} />}
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
              {!this.state.moveFrame.childMoves.length ? <Tag>None</Tag> : <MoveTags type="moveFrames" moves={this.state.moveFrame.childMoves} />}
            </div>
            <Divider />
            <div>
              <h3>Multimedia</h3>
              {!this.state.moveFrame.multimedia.length ? <Tag>None</Tag> : <MultimediaTags multimedia={this.state.moveFrame.multimedia} />}
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
