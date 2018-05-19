import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { List, Button, Modal } from 'antd';
import LoadingMessage from 'App/components/LoadingMessage';

class MoveSetsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectUrl: ''
    };
  }

  redirectToUrl = url => {
    this.setState({redirectUrl: url});
  }

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
        {this.state.redirectUrl ? <Redirect push to={this.state.redirectUrl} /> : null}
        {!loading && (
          <List
            itemLayout="vertical"
            dataSource={this.props.moveSets}
            renderItem={moveSet => (
              <List.Item>
                <div className="clickable" onClick={() => this.redirectToUrl('/moveSets/' + moveSet._id)}>
                  <div style={{ lineHeight: '125%' }}>
                    <span className="list-title">{moveSet.name}</span>
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
