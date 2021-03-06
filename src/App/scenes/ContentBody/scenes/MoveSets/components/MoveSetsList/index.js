import { sentenceCase } from 'helpers/functions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { List, Button, Modal } from 'antd';
import MoveTypeAvatar from '../../../../components/MoveTypeAvatar';
import LoadingMessage from 'App/components/LoadingMessage';

class MoveSetsList extends Component {
  confirmDelete = moveSet => {
    Modal.confirm({
      title: 'Confirm delete',
      content: 'Are you sure to delete "' + moveSet.name + '"?',
      onOk: () => {
        this.props.deleteMove(moveSet._id);
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
            dataSource={this.props.moveSets}
            renderItem={moveSet => (
              <List.Item>
                <div className="vertical-align">
                  <MoveTypeAvatar move={{ type: 'set' }} />
                  <div className="horizontal-spacer" />
                  <div className="right-content">
                    <Link className="list-title" to={'/moveSets/' + moveSet._id}>{moveSet.name}</Link>
                    <br />
                    <span>{sentenceCase(moveSet.type)}</span>
                    {moveSet.draft && <span> (Draft)</span>}
                  </div>
                </div>
                <div className="vertical-spacer" />
                <div className="align-right">
                  <Link to={'/moveSets/edit/' + moveSet._id}>
                    <Button type="dashed" size="small">Edit</Button>
                  </Link>
                  &nbsp;
                  <Button type="danger" size="small" onClick={() => this.confirmDelete(moveSet)}>Delete</Button>
                </div>
              </List.Item>
            )}
          />
        )}
      </LoadingMessage>
    );
  }
}

MoveSetsList.propTypes = {
  loading: PropTypes.bool,
  moveSets: PropTypes.array,
  deleteMove: PropTypes.func
}

export default MoveSetsList;
