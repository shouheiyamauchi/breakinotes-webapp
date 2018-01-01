import { moveTypeColors, moveTypeShortNames } from '../constants'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'
import _ from 'lodash';
import { Avatar, List, Button, Modal } from 'antd';

class MovesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      redirectUrl: ''
    };
  }

  redirectToUrl = url => {
    this.setState({redirect: true});
    this.setState({redirectUrl: url})
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
        {this.state.redirect ? <Redirect push to={this.state.redirectUrl} /> : null}
        <List
          itemLayout="vertical"
          dataSource={this.props.moves}
          renderItem={move => (
            <List.Item>
              <div className="vertical-align clickable" onClick={() => this.redirectToUrl('/move/' + move._id)}>
                <Avatar size="large" style={{ backgroundColor: moveTypeColors[move.type] }}>{moveTypeShortNames[move.type]}</Avatar>
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

MovesList.propTypes = {
  moves: PropTypes.array,
  deleteMove: PropTypes.func
}

export default MovesList;
