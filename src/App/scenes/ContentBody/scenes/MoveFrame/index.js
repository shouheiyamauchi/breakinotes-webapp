import { API_URL } from 'helpers/config';
import { sentenceCase } from 'helpers/functions';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import { Tag, Divider, Button, Modal, Spin } from 'antd';
import MoveTypeAvatar from 'App/components/MoveTypeAvatar';
import MoveTag from '../../components/MoveTag';
import MoveTags from '../../components/MoveTags';
import MultimediaTags from 'App/components/MultimediaTags';
import LoadingMessage from 'App/components/LoadingMessage';

class MoveFrame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moveFrame: {
        name: '',
        origin: '',
        type: '',
        notes: '',
        parent: '',
        childMoves: [],
        entries: [],
        exits: [],
        multimedia: [],
        draft: true
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
          <LoadingMessage />
        ) : (
          <div>
            {this.state.redirectUrl ? <Redirect push to={this.state.redirectUrl} /> : null}
            <div className="vertical-align">
              <MoveTypeAvatar move={this.state.moveFrame} />
              <div className="horizontal-spacer" />
              <div style={{lineHeight:"125%"}}>
                <span className="title">{this.state.moveFrame.name}</span>
                <br />
                <span>{sentenceCase(this.state.moveFrame.origin)} {sentenceCase(this.state.moveFrame.type)}</span>
                {this.state.moveFrame.draft && <span> (Draft)</span>}
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
                <h3>Entry Moves</h3>
                {!this.state.moveFrame.entries.length ? <Tag>None</Tag> : <MoveTags type="moves" moves={this.state.moveFrame.entries} />}
              </div>
              <Divider />
              <div>
                <h3>Exit Moves</h3>
                {!this.state.moveFrame.exits.length ? <Tag>None</Tag> : <MoveTags type="moves" moves={this.state.moveFrame.exits} />}
              </div>
            </div>
            <Divider />
            <div>
              <h3>Parent Frame</h3>
              {!this.state.moveFrame.parent ? <Tag>None</Tag> : <MoveTag type="moveFrames" move={this.state.moveFrame.parent} /> }
            </div>
            <Divider />
            <div>
              <h3>Child Frames</h3>
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
