import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
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
                  <div style={{ lineHeight: '125%' }}>
                    <Link className="list-title" to={'/moveSets/' + moveSet._id}>{moveSet.name}</Link>
                    {moveSet.draft && <div><span>(Draft)</span></div>}
                  </div>
                </div>
                <div className="vertical-spacer" />
                <div className="align-right">
                  <Button type="dashed" size="small" onClick={() => this.redirectToUrl('/moveSets/edit/' + moveSet._id)}>Edit</Button>
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
