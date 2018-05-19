import { API_URL } from 'helpers/config';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import { Tag, Divider, Button, Modal } from 'antd';
import SetTags from '../../components/SetTags';
import MultimediaTags from '../../components/MultimediaTags';
import LoadingMessage from 'App/components/LoadingMessage';

class MoveSet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      set: {
        name: '',
        moves: [],
        notes: '',
        multimedia: [],
        draft: true
      },
      redirectUrl: '',
      loading: true
    };
  }

  componentDidMount() {
    this.getSet(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.getSet(nextProps.match.params.id);
  }

  getSet = id => {
    axios.get(API_URL + 'moveSets/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        const moves = response.data.moves.map(move => {
          return {
            item: move.item._id,
            moveType: move.moveType,
            name: move.item.name,
            type: move.item.type
          };
        });

        this.setState({
          set: { ...response.data, moves },
          loading: false
        });
      })
      .catch((error) => {
        this.props.removeAuthToken();
      })
  }

  editMove = () => {
    this.setState({redirectUrl: '/moveSets/edit/' + this.state.set._id});
  }

  confirmDelete = () => {
    Modal.confirm({
      title: 'Confirm delete',
      content: 'Are you sure to delete "' + this.state.set.name + '"?',
      onOk: () => {
        this.deleteMove();
      },
      onCancel() {},
    });
  }

  deleteMove = () => {
    axios.delete(API_URL + 'moveSets/' + this.state.set._id, {
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
    const {
      loading
    } = this.state;

    const moves = this.state.set.moves.map(move => {
      return {
        type: move.moveType[0].toLowerCase() + move.moveType.substr(1) + 's',
        move: {
          _id: move.item,
          type: move.type,
          name: move.name
        }
      };
    });

    return (
      <LoadingMessage loading={loading}>
        {!loading && (
          <div>
            {this.state.redirectUrl ? <Redirect push to={this.state.redirectUrl} /> : null}
            <div style={{ lineHeight: '125%' }}>
              <span className="title">{this.state.set.name}</span>
              {this.state.set.draft && <div><span> (Draft)</span></div>}
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
              <h3>Set Moves</h3>
              {!moves.length ? <Tag>None</Tag> : <SetTags moves={moves} /> }
            </div>
            <Divider />
            <div>
              <h3>Multimedia</h3>
              {!this.state.set.multimedia.length ? <Tag>None</Tag> : <MultimediaTags multimedia={this.state.set.multimedia} />}
            </div>
            <Divider />
            <div>
              <h3>Notes</h3>
              {!this.state.set.notes ? 'None' : this.state.set.notes}
            </div>
          </div>
        )}
      </LoadingMessage>
    );
  }
}

export default MoveSet;
