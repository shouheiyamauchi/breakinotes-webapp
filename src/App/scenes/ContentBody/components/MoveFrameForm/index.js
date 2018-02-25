import { API_URL } from 'helpers/config'
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import qs from 'qs';
import _ from 'lodash';
import { Divider, Form, Input, Icon, Select, Upload, Progress, Button, Tag } from 'antd';
import MoveTag from '../MoveTag';
import MultimediaTags from '../MultimediaTags'

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class MoveForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moveFrames: [],
      name: '',
      origin: 'disabled',
      type: 'disabled',
      notes: '',
      parent: null,
      multimedia: [],
      redirectUrl: '',
      uploading: new Map()
    };
  }

  componentDidMount() {
    if (this.editPage()) this.getMoveFrame(this.props.id); // edit page will have the move id as prop
    this.getMoveFrames();
  }

  editPage = () => {
    return this.props.id
  }

  getMoveFrames = () => {
    axios.get(API_URL + 'moveFrames', {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({moveFrames: response.data});
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  getMoveFrame = id => {
    axios.get(API_URL + 'moveFrames/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({
          name: response.data.name,
          origin: response.data.origin,
          type: response.data.type,
          notes: response.data.notes,
          parent: response.data.parent,
          multimedia: response.data.multimedia
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  setSingleMove = (id, state) => {
    axios.get(API_URL + 'moveFrames/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({[state]: response.data});
      })
      .catch((error) => {
        this.props.removeAuthToken();
      })
  }

  clearSingleMove = (e, state) => {
    e.preventDefault();
    this.setState({[state]: null});
  }

  addMoveToArray = (id, state) => {
    axios.get(API_URL + 'moves/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({[state]: [...this.state[state], response.data]});
      })
      .catch((error) => {
        this.props.removeAuthToken();
      })
  }

  removeMoveFromArray = (e, state) => {
    e.preventDefault();
    const moveUrl = e.target.parentElement.childNodes[0].childNodes[0].href;
    const moveId = moveUrl.substr(moveUrl.lastIndexOf('/') + 1);

    this.setState({[state]: this.state[state].filter(move => move._id !== moveId)});
  }

  removeMultimediaFromArray = (e, multimediaProp) => {
    e.preventDefault();

    this.setState({multimedia: this.state.multimedia.filter(multimedia => multimedia.value !== multimediaProp.value)});
  }

  handleInputChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  handleSelectChange = (value, name) => {
    this.setState({[name]: value});
  }

  handleSubmit = e => {
    e.preventDefault();

    !this.editPage() ? this.postNewMoveFrame() : this.updateMoveFrame();
  }

  postNewMoveFrame = () => {
    axios.post(API_URL + 'moveFrames', qs.stringify({
      name: this.state.name,
      origin: this.state.origin,
      type: this.state.type,
      notes: this.state.notes,
      parent: (this.state.parent) ? this.state.parent._id : null,
      multimedia: JSON.stringify(this.state.multimedia)
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({redirectUrl: '/moveFrames/' + response.data._id});
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  updateMoveFrame = () => {
    axios.put(API_URL + 'moveFrames/' + this.props.id, qs.stringify({
      name: this.state.name,
      origin: this.state.origin,
      type: this.state.type,
      notes: this.state.notes,
      parent: (this.state.parent) ? this.state.parent._id : null,
      multimedia: JSON.stringify(this.state.multimedia)
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({redirectUrl: '/moveFrames/' + response.data._id});
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  getSignedRequestAndUpload = file => {
    axios.post(API_URL + 's3/signed-url', qs.stringify({
      fileName: file.uid + '/' + file.name,
      fileType: file.type
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.uploadFile(file, response.data.signedRequest, response.data.url);
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  uploadFile = (file, signedRequest, url) => {
    this.setState({
      uploading: this.state.uploading.set(file, {name: file.name, progress: 0})
    })

    const options = {
      headers: {
        'Content-Type': file.type
      },
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round(progressEvent.loaded / progressEvent.total * 100);

        this.setState({uploading: this.state.uploading.set(file, {name: file.name, progress: percentCompleted})})
      }
    };

    axios.put(signedRequest, file, options)
      .then((response) => {
        this.state.uploading.delete(file);
        this.setState({uploading: this.state.uploading});

        this.setState({ multimedia:
          [...this.state.multimedia,
            {
              name: file.name,
              source: 's3',
              value: file.uid + '/' + file.name
            }
          ]
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateFileName = (e, multimediaValue, newName) => {
    e.preventDefault();

    const multimediaIndex = this.state.multimedia.findIndex(multimedia => multimedia.value === multimediaValue);

    const multimedia = this.state.multimedia[multimediaIndex];
    multimedia.name = newName;

    this.setState({multimedia: this.state.multimedia});
  }

  addExtraPositions = (selectedValues, extraStartingOrEndingPositions) => {
    this.setState({[extraStartingOrEndingPositions]: selectedValues});
  }

  render() {
    const parentOptions = this.state.moveFrames.map((moveFrame, index) => {
      if (this.props.id !== moveFrame._id && (!this.state.parent || this.state.parent._id !== moveFrame._id)) {
        return <Option value={moveFrame._id} key={index}>{_.capitalize(moveFrame.type) + ' - ' + moveFrame.name}</Option>;
      };
      return null;
    })

    const uploadProps = {
      beforeUpload: (file) => {
        this.getSignedRequestAndUpload(file);
        return false;
      }
    }

    const uploadingMapClone = new Map(this.state.uploading);

    const uploadingArray = Array.from(uploadingMapClone.keys()).map(key => {
      return {fileObject: key, name: uploadingMapClone.get(key)['name'], progress: uploadingMapClone.get(key)['progress']};
    });

    const uploadProgress = uploadingArray.map((file, index) => {
      return (
        <div key={index}>
          {file.name}
          <Progress percent={file.progress} status="active" />
        </div>
      )
    })

    return (
      <div>
        {this.state.redirectUrl ? <Redirect push to={this.state.redirectUrl} /> : null}
        <span className="title">{!this.editPage() ? 'Add New Move Frame' : 'Edit Move Frame'}</span>
        <Divider />
        <div className="vertical-spacer" />
        <Form onSubmit={this.handleSubmit} layout='vertical'>
          <FormItem label='Name'>
            <Input placeholder="Name of the move frame" name='name' value={this.state.name} onChange={this.handleInputChange} />
          </FormItem>
          <FormItem label='Origin'>
            <Select
              showSearch
              placeholder='Origin'
              value={this.state.origin}
              onChange={(value) => this.handleSelectChange(value, 'origin')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="disabled" disabled>Select the move origin</Option>
              <Option value="foundational">Foundational</Option>
              <Option value="original">Original</Option>
              <Option value="other">Other</Option>
            </Select>
          </FormItem>
          <FormItem label='Type'>
            <Select
              showSearch
              placeholder='Type'
              value={this.state.type}
              onChange={(value) => this.handleSelectChange(value, 'type')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="disabled" disabled>Select the move type</Option>
              <Option value="floorPosition">Floor Position</Option>
              <Option value="floorFreeze">Floor Freeze</Option>
              <Option value="midPosition">Mid Position</Option>
              <Option value="midFreeze">Mid Freeze</Option>
              <Option value="standingPosition">Standing Position</Option>
              <Option value="standingFreeze">Standing Freeze</Option>
              <Option value="handstandPosition">Handstand Position</Option>
              <Option value="handstandFreeze">Handstand Freeze</Option>
              <Option value="airPosition">Air Position</Option>
              <Option value="airFreeze">Air Freeze</Option>
            </Select>
          </FormItem>
          <div className="ant-form-item-label">
            <label>Multimedia</label>
          </div>
          <Upload {...uploadProps}>
            <Button>
              <Icon type="upload" />Select File
            </Button>
          </Upload>
          <div className="vertical-spacer" />
          {uploadProgress}
          Uploaded
          <br />
          {this.state.multimedia.length === 0 ? <Tag>None</Tag> : <MultimediaTags multimedia={this.state.multimedia} updateFileName={this.updateFileName} closable={true} onClose={this.removeMultimediaFromArray} />}
          <div className="vertical-spacer" />
          <div className="vertical-spacer" />
          <FormItem label='Notes'>
            <TextArea placeholder="Add some notes" rows={4} name='notes' value={this.state.notes} onChange={this.handleInputChange} />
          </FormItem>
          <div className="ant-form-item-label">
            <label>Variations</label>
          </div>
          <FormItem>
            <Select
              showSearch
              placeholder='Parent Frame'
              value='disabled'
              onSelect={(value) => this.setSingleMove(value, 'parent')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value='disabled' disabled>Parent Move</Option>
              {parentOptions}
            </Select>
            {
              (!this.state.parent) ?
              <Tag>Select a move from above</Tag> :
              <MoveTag type="moveFrames" move={this.state.parent} closable={true} onClose={(e) => this.clearSingleMove(e, 'parent')} />
            }
          </FormItem>
          <FormItem>
            <Button type='primary' htmlType='submit'>
              {!this.editPage() ? 'Add Move' : 'Edit Move'}
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default MoveForm;
