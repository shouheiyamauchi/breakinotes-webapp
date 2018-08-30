import { sentenceCase } from 'helpers/functions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { List, Button, Modal } from 'antd';
import MoveTypeAvatar from '../../../../components/MoveTypeAvatar';
import LoadingMessage from 'App/components/LoadingMessage';

class MoveFramesList extends Component {
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
        {!loading && (
          <List
            itemLayout="vertical"
            dataSource={this.props.moveFrames}
            renderItem={moveFrame => (
              <List.Item>
                <div className="vertical-align">
                  <MoveTypeAvatar move={moveFrame} />
                  <div className="horizontal-spacer" />
                  <div className="right-content">
                    <Link className="list-title" to={'/moveFrames/' + moveFrame._id}>{moveFrame.name}</Link>
                    <br />
                    <span>{sentenceCase(moveFrame.origin)} {sentenceCase(moveFrame.type)}</span>
                    {moveFrame.draft && <span> (Draft)</span>}
                  </div>
                </div>
                <div className="vertical-spacer" />
                <div className="align-right">
                  <Link to={'/moveFrames/edit/' + moveFrame._id}>
                    <Button type="dashed" size="small">Edit</Button>
                  </Link>
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
