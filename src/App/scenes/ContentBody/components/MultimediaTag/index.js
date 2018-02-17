import { API_URL } from 'helpers/config'
import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import PropTypes from 'prop-types';
import { Tag, Modal, Spin, Button, Form, Input } from 'antd';
import MultimediaDisplay from '../MultimediaDisplay';

class MultimediaTag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      multimediaModalVisible: false,
      editModalVisible: false,
      multimediaUrl: '',
      newName: this.props.multimedia.name
    };
  }

  showModal = () => {
    this.getMultimediaUrl();
    this.setState({
      multimediaModalVisible: true,
    });
  }

  getMultimediaUrl = () => {
    axios.post(API_URL + 's3/url-with-token', qs.stringify({
      fileName: this.props.multimedia.value
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({multimediaUrl: response.data});
      })
      .catch((error) => {
        this.props.removeAuthToken();
      })
  }

  handleCancel = e => {
    this.setState({
      multimediaModalVisible: false,
    });
  }

  showEditModal = e => {
    this.setState({
      editModalVisible: true,
    });
  }

  handleEditCancel = e => {
    this.setState({
      newName: this.props.multimedia.name,
      editModalVisible: false,
    });
  }

  handleInputChange = e => {
    this.setState({newName: e.target.value});
  }

  render() {
    return (
        <Tag closable={this.props.closable} onClose={this.props.onClose}>
          <span onClick={this.showModal}>{this.props.multimedia.name}</span>
          <Modal
            title={this.props.multimedia.name}
            visible={this.state.multimediaModalVisible}
            onCancel={this.handleCancel}
            footer={this.props.updateFileName ? <Button type="dashed" size="small" onClick={this.showEditModal}>Edit Media Name</Button> : null}
          >
            {!this.state.multimediaUrl ? <div className="align-center"><Spin tip="Loading..." /></div> : <MultimediaDisplay fileName={this.props.multimedia.value} multimediaUrl={this.state.multimediaUrl} visible={this.state.multimediaModalVisible} />}
          </Modal>
          <Modal
            title="Edit Multimedia Name"
            visible={this.state.editModalVisible}
            onOk={(e) => {this.props.updateFileName(e, this.props.multimedia.value, this.state.newName); this.setState({editModalVisible:false, multimediaModalVisible:false});}}
            onCancel={this.handleEditCancel}
          >
            <Form.Item>
              <Input placeholder="New multimedia name" value={this.state.newName} onChange={this.handleInputChange} />
            </Form.Item>
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
