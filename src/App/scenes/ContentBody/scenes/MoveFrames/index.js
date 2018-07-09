import { API_URL } from 'helpers/config'
import React, { Component } from 'react';
import { Divider } from 'antd';
import axios from 'axios';
import qs from 'qs';
import MoveFramesList from './components/MoveFramesList';

class MoveFrames extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moveFrames: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getMoves();
  }

  getMoves = () => {
    this.setState({loading: true}, () => {
      axios.post(API_URL + 'moveFrames/filter', qs.stringify({

      }), {
        headers: {
          Authorization: 'JWT ' + localStorage.getItem('breakinotes')
        }
      })
        .then((response) => {
          this.setState({
            moveFrames: response.data,
            loading: false
          });
        })
        .catch((error) => {
          this.props.removeAuthToken();
        });
    });

  }

  deleteMove = id => {
    axios.delete(API_URL + 'moveFrames/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.getMoves();
        return
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  render() {
    return (
      <div>
        <span className="title">Frames List</span>
        <Divider />
        <MoveFramesList moveFrames={this.state.moveFrames} deleteMove={this.deleteMove} loading={this.state.loading} />
      </div>
    );
  }
}

export default MoveFrames;
