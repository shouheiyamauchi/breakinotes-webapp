import { sentenceCase } from 'helpers/functions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { List, Button, Modal } from 'antd';
import MoveTypeAvatar from 'App/components/MoveTypeAvatar';
import LoadingMessage from 'App/components/LoadingMessage';

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
    const {
      loading
    } = this.props;

    return (
      <LoadingMessage loading={loading}>
        {this.state.redirectUrl ? <Redirect push to={this.state.redirectUrl} /> : null}
        {!loading && (
          <List
            itemLayout="vertical"
            dataSource={this.props.moveFrames}
            renderItem={moveFrame => (
              <List.Item>
                <div className="vertical-align clickable" onClick={() => this.redirectToUrl('/moveFrames/' + moveFrame._id)}>
                  <MoveTypeAvatar move={moveFrame} />
                  <div className="horizontal-spacer" />
                  <div style={{ lineHeight: '125%' }}>
                    <span className="list-title">{moveFrame.name}</span>
                    <br />
                    <span>{sentenceCase(moveFrame.origin)} {sentenceCase(moveFrame.type)}</span>
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
      </LoadingMessage>
    );
  }
}

MoveFramesList.propTypes = {
  loading: PropTypes.bool,
  moveFrames: PropTypes.array,
  deleteMove: PropTypes.func
}

export default MoveFramesList;
