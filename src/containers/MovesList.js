import { config } from '../config'
import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios';
import _ from 'lodash';
import { List, Button, Modal } from 'antd';
import MoveTypeAvatar from '../components/MoveTypeAvatar';

class MovesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moves: [],
      redirect: false,
      redirectUrl: ''
    };

    this.getMoves = this.getMoves.bind(this);
    this.redirectToUrl = this.redirectToUrl.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.deleteMove = this.deleteMove.bind(this);
  };

  componentDidMount() {
    this.getMoves();
  }

  getMoves() {
    axios.get(config.API_URL + 'moves')
      .then((response) => {
        this.setState({moves: response.data});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  redirectToUrl(url) {
    this.setState({redirect: true});
    this.setState({redirectUrl: url})
  }

  confirmDelete(move) {
    Modal.confirm({
      title: 'Confirm delete',
      content: 'Are you sure to delete "' + move.name + '"?',
      onOk: () => {
        this.deleteMove(move._id);
      },
      onCancel() {},
    });
  }

  deleteMove(id) {
    axios.delete(config.API_URL + 'moves/' + id)
      .then((response) => {
        this.getMoves();
        return
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        {this.state.redirect ? <Redirect push to={this.state.redirectUrl} /> : null}
        <List
          itemLayout="vertical"
          dataSource={this.state.moves}
          renderItem={move => (
            <List.Item>
              <div className="vertical-align" onClick={() => this.redirectToUrl('/move/' + move._id)}>
                <MoveTypeAvatar move={move} />
                <div className="horizontal-spacer" />
                <div style={{lineHeight:"125%"}}>
                  <span className="list-title">{move.name}</span>
                  <br />
                  <span>{_.capitalize(move.origin)} {_.capitalize(move.type)}</span>
                </div>
              </div>
              <div className="vertical-spacer" />
              <div className="align-right">
                <Button type="dashed" size="small">Edit</Button>
                &nbsp;
                <Button type="danger" size="small" onClick={() => this.confirmDelete(move)}>Delete</Button>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default MovesList;
