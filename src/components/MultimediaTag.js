import { config } from '../config'
import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import PropTypes from 'prop-types';
import { Tag, Modal, Spin } from 'antd';
import MultimediaDisplay from './MultimediaDisplay';

class MultimediaTag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      multimediaModalVisible: false,
      multimediaUrl: ''
    };
  }

  showModal = () => {
    this.getMultimediaUrl();
    this.setState({
      multimediaModalVisible: true,
    });
  }

  getMultimediaUrl = () => {
    axios.post(config.API_URL + 's3/url-with-token', qs.stringify({
      fileName: this.props.multimedia.value
    }))
      .then((response) => {
        this.setState({multimediaUrl: response.data});
      })
      .catch((error) => {
        console.log(error);
      })
  }

  handleCancel = e => {
    this.setState({
      multimediaModalVisible: false,
    });
  }

  render() {
    return (
        <Tag closable={this.props.closable} onClose={this.props.onClose}>
          <span onClick={this.showModal}>{this.props.multimedia.name}</span>
          <Modal
            title={this.props.multimedia.name}
            visible={this.state.multimediaModalVisible}
            onCancel={this.handleCancel}
            footer={null}
          >
            {!this.state.multimediaUrl ? <div className="align-center"><Spin tip="Loading..." /></div> : <MultimediaDisplay fileName={this.props.multimedia.value} multimediaUrl={this.state.multimediaUrl} visible={this.state.multimediaModalVisible} />}
          </Modal>
        </Tag>
    );
  }
}

MultimediaTag.propTypes = {
  multimedia: PropTypes.object,
  closable: PropTypes.bool,
  onClose: PropTypes.func
}

MultimediaTag.defaultProps = {
  closable: false
}

export default MultimediaTag;
