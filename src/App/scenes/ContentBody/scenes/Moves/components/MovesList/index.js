import { sentenceCase } from 'helpers/functions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'
import { List, Button, Modal } from 'antd';
import MoveTypeAvatar from 'App/components/MoveTypeAvatar';
import LoadingMessage from 'App/components/LoadingMessage';

class MovesList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    moves: PropTypes.array,
    deleteMove: PropTypes.func
  }

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
    const {
      redirectToUrl,
      confirmDelete
    } = this;

    const {
      redirectUrl
    } = this.state;

    const {
      loading,
      moves
    } = this.props;

    return (
      <LoadingMessage loading={loading}>
        {redirectUrl ? <Redirect push to={redirectUrl} /> : null}
        {!loading && (
          <List
            itemLayout="vertical"
            dataSource={moves}
            renderItem={move => (
              <List.Item>
                <div className="vertical-align clickable" onClick={() => redirectToUrl('/moves/' + move._id)}>
                  <MoveTypeAvatar move={move} />
                  <div className="horizontal-spacer" />
                  <div style={{ lineHeight: '125%' }}>
                    <span className="list-title">{move.name}</span>
                    <br />
                    <span>{sentenceCase(move.origin)} {sentenceCase(move.type)}</span>
                    {move.draft && <span> (Draft)</span>}
                  </div>
                </div>
                <div className="vertical-spacer" />
                <div className="align-right">
                  <Button type="dashed" size="small" onClick={() => redirectToUrl('/moves/edit/' + move._id)}>Edit</Button>
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
