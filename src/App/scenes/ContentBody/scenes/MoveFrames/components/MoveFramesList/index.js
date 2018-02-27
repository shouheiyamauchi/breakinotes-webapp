import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'
import _ from 'lodash';
import { List, Button, Modal, Spin } from 'antd';
import MoveTypeAvatar from 'App/components/MoveTypeAvatar';

class MoveFramesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectUrl: ''
    };
  }

  redirectToUrl = url => {
    this.setState({redirectUrl: url});
  }

  confirmDelete = moveFrame => {
    Modal.confirm({
      title: 'Confirm delete',
      content: 'Are you sure to delete "' + moveFrame.name + '"?',
      onOk: () => {
        this.props.deleteMove(moveFrame._id);
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
            dataSource={this.props.moveFrames}
            renderItem={moveFrame => (
              <List.Item>
                <div className="vertical-align clickable" onClick={() => this.redirectToUrl('/moveFrames/' + moveFrame._id)}>
                  <MoveTypeAvatar move={moveFrame} />
                  <div className="horizontal-spacer" />
                  <div style={{lineHeight:"125%"}}>
                    <span className="list-title">{moveFrame.name}</span>
                    <br />
                    <span>{_.capitalize(moveFrame.origin)} {_.capitalize(moveFrame.type)}</span>
                    {moveFrame.draft && <span> (Draft)</span>}
                  </div>
                </div>
                <div className="vertical-spacer" />
                <div className="align-right">
                  <Button type="dashed" size="small" onClick={() => this.redirectToUrl('/moveFrames/edit/' + moveFrame._id)}>Edit</Button>
                  &nbsp;
                  <Button type="danger" size="small" onClick={() => this.confirmDelete(moveFrame)}>Delete</Button>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
    );
  }
}

MoveFramesList.propTypes = {
  loading: PropTypes.bool,
  moveFrames: PropTypes.array,
  deleteMove: PropTypes.func
}

export default MoveFramesList;
