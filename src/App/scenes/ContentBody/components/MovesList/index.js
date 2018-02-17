import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'
import _ from 'lodash';
import { List, Button, Modal, Spin } from 'antd';
import MoveTypeAvatar from '../MoveTypeAvatar';

class MovesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectUrl: ''
    };
  }

  redirectToUrl = url => {
    this.setState({redirectUrl: url});
  }

  confirmDelete = move => {
    Modal.confirm({
      title: 'Confirm delete',
      content: 'Are you sure to delete "' + move.name + '"?',
      onOk: () => {
        this.props.deleteMove(move._id);
      },
      onCancel() {},
    });
  }

  render() {
    return (
      <div>
        {this.state.redirectUrl ? <Redirect push to={this.state.redirectUrl} /> : null}
        {this.props.loading ? (
          <div className="align-center">
            <div className="vertical-spacer" />
            <div className="vertical-spacer" />
            <Spin />
            <br/>Loading...
          </div>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={this.props.moves}
            renderItem={move => (
              <List.Item>
                <div className="vertical-align clickable" onClick={() => this.redirectToUrl('/moves/' + move._id)}>
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
                  <Button type="dashed" size="small" onClick={() => this.redirectToUrl('/moves/edit/' + move._id)}>Edit</Button>
                  &nbsp;
                  <Button type="danger" size="small" onClick={() => this.confirmDelete(move)}>Delete</Button>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
    );
  }
}

MovesList.propTypes = {
  loading: PropTypes.bool,
  moves: PropTypes.array,
  deleteMove: PropTypes.func
}

export default MovesList;