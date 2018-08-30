import { API_URL } from 'helpers/config'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import axios from 'axios';
import qs from 'qs';
import { Divider, List, Checkbox, Modal, Select, Input, Button } from 'antd';
import LoadingMessage from 'App/components/LoadingMessage';
import MoveTag from '../../components/MoveTag'

const Option = Select.Option;

class Untouched extends Component {
  static propTypes = {
    removeAuthToken: PropTypes.func.isRequired
  }

  state = {
    loading: false,
    value: '2',
    unit: 'weeks',
    moves: [],
    movesFrames: []
  };

  componentDidMount() {
    this.getUntouchedMoves();
  }

  getUntouchedMoves = () => {
    this.setState({ loading: true }, () => {
      Promise.all([
        axios.post(API_URL + 'moves/touched', qs.stringify({
          value: this.state.value,
          unit: this.state.unit
        }), {
          headers: {
            Authorization: 'JWT ' + localStorage.getItem('breakinotes')
          }
        }),
        axios.post(API_URL + 'moveFrames/touched', qs.stringify({
          value: this.state.value,
          unit: this.state.unit
        }), {
          headers: {
            Authorization: 'JWT ' + localStorage.getItem('breakinotes')
          }
        })
      ])
        .then((values) => {
          this.setState({
            loading: false,
            moves: values[0].data,
            moveFrames: values[1].data
          });
        })
        .catch((error) => {
          this.props.removeAuthToken();
        });
    });
  }

  confirmForceTouch = (moveOrFrames, move) => {
    this.updateCustomAttribute(moveOrFrames, move._id, 'loading', true);

    Modal.confirm({
      title: 'Confirm force touch',
      content: 'Are you sure to force touch "' + move.name + '"?',
      onOk: () => {
        this.forceTouch(moveOrFrames, move._id);
      },
      onCancel: () => {
        this.updateCustomAttribute(moveOrFrames, move._id, 'loading', false);
      }
    });
  }

  forceTouch = (moveOrFrames, id) => {
    axios.post(API_URL + moveOrFrames + '/forceTouch/' + id, qs.stringify({}), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.updateCustomAttribute(moveOrFrames, id, 'loading', false, () => {
          this.updateCustomAttribute(moveOrFrames, id, 'forceUntouched', true)
        });
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  updateCustomAttribute = (moveOrFrames, id, customAttribute, value, cb = () => {}) => {
    const index = this.state[moveOrFrames].findIndex((move) => move._id === id)
    this.setState({ [moveOrFrames]: update(this.state[moveOrFrames], { [index]: { [customAttribute]: { $set: value }}}) }, () => cb())
  }

  changeValue = (e) => {
    this.setState({ value: e.target.value })
  }

  changeUnit = (unit) => {
    this.setState({ unit })
  }

  render() {
    const {
      loading,
      unit,
      value,
      moves,
      moveFrames,
    } = this.state;

    return (
      <div>
        <span className="title">Untouched Moves</span>
        <Divider />
        <div style={{ display: 'flex' }}>
          <Input value={value} placeholder="Value" style={{ width: '75px', marginBottom: '10px' }} onChange={this.changeValue} />
          <div style={{ width: '10px' }} />
          <Select defaultValue={unit} style={{ width: '100%' }} onChange={this.changeUnit}>
            <Option value="hours">Hours</Option>
            <Option value="days">Days</Option>
            <Option value="weeks">Weeks</Option>
            <Option value="months">Months</Option>
          </Select>
        </div>
        <Button type="primary" style={{ width: '100%' }} onClick={this.getUntouchedMoves}>Refresh List</Button>
        <div className="vertical-spacer" />
        <LoadingMessage loading={loading}>
          {!loading && (
            <div>
              <div className="list-title">Moves</div>
              <div className="vertical-spacer" />
              <List
                size="small"
                dataSource={moves}
                renderItem={move => (
                  <List.Item actions={[
                    <Checkbox
                      checked={move.forceUntouched}
                      disabled={move.loading || move.forceUntouched}
                      onChange={() => this.confirmForceTouch('moves', move)}
                    />
                  ]}>
                    <MoveTag move={move} type="moves" removeAuthToken={this.props.removeAuthToken} />
                  </List.Item>
                )}
              />
              <div className="vertical-spacer" />
              <div className="list-title">Move Frames</div>
              <div className="vertical-spacer" />
              <List
                size="small"
                dataSource={moveFrames}
                renderItem={moveFrame => (
                  <List.Item actions={[
                    <Checkbox
                      checked={moveFrame.forceUntouched}
                      disabled={moveFrame.loading || moveFrame.forceUntouched}
                      onChange={() => this.confirmForceTouch('moveFrames', moveFrame)}
                    />
                  ]}>
                    <MoveTag move={moveFrame} type="moveFrames" removeAuthToken={this.props.removeAuthToken} />
                  </List.Item>
                )}
              />
            </div>
          )}
        </LoadingMessage>
      </div>
    );
  }
}

export default Untouched;
