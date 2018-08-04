import { sentenceCase } from 'helpers/functions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { List, Button, Modal } from 'antd';
import MoveTypeAvatar from '../../../../components/MoveTypeAvatar';
import LoadingMessage from 'App/components/LoadingMessage';

class MovesList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    moves: PropTypes.array,
    deleteMove: PropTypes.func
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
    const {
      confirmDelete
    } = this;

    const {
      loading,
      moves
    } = this.props;

    return (
      <LoadingMessage loading={loading}>
        {!loading && (
          <List
            itemLayout="vertical"
            dataSource={moves}
            renderItem={move => (
              <List.Item>
                <div className="vertical-align">
                  <MoveTypeAvatar move={move} />
                  <div className="horizontal-spacer" />
                  <div style={{ lineHeight: '125%' }}>
                    <Link className="list-title" to={'/moves/' + move._id}>{move.name}</Link>
                    <br />
                    <span>{sentenceCase(move.origin)} {sentenceCase(move.type)}</span>
                    {move.draft && <span> (Draft)</span>}
                  </div>
                </div>
                <div className="vertical-spacer" />
                <div className="align-right">
                  <Link to={'/moves/edit/' + move._id}>
                    <Button type="dashed" size="small">Edit</Button>
                  </Link>
                  &nbsp;
                  <Button type="danger" size="small" onClick={() => confirmDelete(move)}>Delete</Button>
                </div>
              </List.Item>
            )}
          />
        )}
      </LoadingMessage>
    );
  }
}

export default MovesList;
