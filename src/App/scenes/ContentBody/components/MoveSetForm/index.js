import { API_URL } from 'helpers/config';
import { sentenceCase } from 'helpers/functions';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import { Divider, Form, Input, Select, Upload, Progress, Button, Icon, Tag } from 'antd';
import MultimediaTags from '../MultimediaTags';
import SetTags from '../SetTags';
import LoadingMessage from 'App/components/LoadingMessage';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class MoveSetForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      moveType: 'disabled',
      moveOptions: [],
      moveFrames: [],
      name: '',
      moves: [],
      notes: '',
      multimedia: [],
      draft: true,
      redirectUrl: '',
      uploading: new Map()
    };
  }

  componentDidMount() {
    if (this.editPage()) {
      this.getSet(this.props.id);
    } else {
      this.setState({ loading: false });
    };
  }

  editPage = () => {
    return !!this.props.id;
  }

  getSet = id => {
    axios.get(API_URL + 'moveSets/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        const moves = response.data.moves.map(move => {
          return {
            item: move.item._id,
            moveType: move.moveType,
            name: move.item.name,
            type: move.item.type
          };
        });

        this.setState({
          loading: false,
          name: response.data.name,
          notes: response.data.notes,
          moves,
          multimedia: response.data.multimedia,
          draft: response.data.draft
        });
      })
      .catch((error) => {
        this.props.removeAuthToken();
      })
  }

  retrieveMoves = () => {
    if (this.state.moveType !== 'disabled') {
      const resourceName = this.state.moveType[0].toLowerCase() + this.state.moveType.substr(1) + 's';

      axios.get(API_URL + resourceName, {
        headers: {
          Authorization: 'JWT ' + localStorage.getItem('breakinotes')
        }
      })
        .then((response) => {
          this.setState({ moveOptions: response.data });
        })
        .catch((error) => {
          this.props.removeAuthToken();
        });
    };
  }

  handleInputChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleSelectChange = (value, name) => {
    if (name === 'move') {
      if (value !== 'disabled') this.addMoveToArray(JSON.parse(value));
    } else {
      this.setState({ [name]: value }, () => {
        if (name === 'moveType') this.retrieveMoves();
      });
    };
  }

  addMoveToArray = move => {
    this.setState({ moves: this.state.moves.concat(move) });
  }

  removeMoveFromArray = (e, index) => {
    e.preventDefault();

    const moves = [...this.state.moves];
    moves.splice(index, 1);

    this.setState({ moves });
  }

  handleSubmit = e => {
    e.preventDefault();

    this.editPage() ? this.updateSet() : this.submitNewSet();
  }

  submitNewSet = () => {
    const moves = this.state.moves.map(move => { return { moveType: move.moveType, item: move.item }});

    axios.post(API_URL + 'moveSets', qs.stringify({
      name: this.state.name,
      moves: JSON.stringify(moves),
      notes: this.state.notes,
      multimedia: JSON.stringify(this.state.multimedia),
      draft: this.state.draft
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({redirectUrl: '/moveSets/' + response.data._id});
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  updateSet = () => {
    const moves = this.state.moves.map(move => { return { moveType: move.moveType, item: move.item }});

    axios.put(API_URL + 'moveSets/' + this.props.id, qs.stringify({
      name: this.state.name,
      moves: JSON.stringify(moves),
      notes: this.state.notes,
      multimedia: JSON.stringify(this.state.multimedia),
      draft: this.state.draft
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({redirectUrl: '/moveSets/' + response.data._id});
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

  removeMultimediaFromArray = (e, multimediaProp) => {
    e.preventDefault();

    this.setState({multimedia: this.state.multimedia.filter(multimedia => multimedia.value !== multimediaProp.value)});
  }

  render() {
    const {
      handleSelectChange,
      handleSubmit,
      removeMoveFromArray
    } = this;

    const {
      loading,
      moveType,
      name,
      notes,
      draft
    } = this.state;

    const moveOptions = this.state.moveOptions.map((move, index) => {
      return <Option value={JSON.stringify({moveType: moveType, item: move._id, name: move.name, type: move.type})} key={index}>
        {(move.type ? sentenceCase(move.type) + ' - ' : '') + move.name}
      </Option>
    });

    const uploadProps = {
      beforeUpload: (file) => {
        this.getSignedRequestAndUpload(file);
        return false;
      }
    };

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
    });

    const moves = this.state.moves.map(move => {
      return {
        type: move.moveType[0].toLowerCase() + move.moveType.substr(1) + 's',
        move: {
          _id: move.item,
          type: move.type,
          name: move.name
        }
      };
    });

    return (
      <LoadingMessage loading={loading}>
        {this.state.redirectUrl ? <Redirect push to={this.state.redirectUrl} /> : null}
        <span className="title">{!this.editPage() ? 'Add New Set' : 'Edit Set'}</span>
        <Divider />
        <div className="vertical-spacer" />
        <Form onSubmit={handleSubmit} layout='vertical'>
          <FormItem label='Name'>
            <Input placeholder="Name of the move" name='name' value={name} onChange={this.handleInputChange} />
          </FormItem>
          <FormItem label='Move Type'>
            <Select
              showSearch
              value={moveType}
              onChange={value => { handleSelectChange(value, 'moveType'); handleSelectChange('disabled', 'move'); }}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="disabled" disabled>Select the move type</Option>
              <Option value="MoveFrame">Frames</Option>
              <Option value="Move">Moves</Option>
            </Select>
          </FormItem>
          <FormItem label='Move'>
            <Select
              showSearch
              value="disabled"
              onChange={value => handleSelectChange(value, 'move')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="disabled" disabled>Select the move</Option>
              {moveOptions}
            </Select>
          </FormItem>
          <div className="ant-form-item-label">
            <label>Set</label>
          </div>
          {moves.length ? (
            <SetTags moves={moves} closable={true} onClose={removeMoveFromArray} />
          ) : (
            <Tag>Select moves from above</Tag>
          )}
          <div className="vertical-spacer" />
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
            <TextArea placeholder="Add some notes" rows={4} name='notes' value={notes} onChange={this.handleInputChange} />
          </FormItem>
          <FormItem label='Draft'>
            <Select
              showSearch
              placeholder='Draft'
              value={draft.toString()}
              onChange={(value) => handleSelectChange(value, 'draft')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value={'true'}>Yes</Option>
              <Option value={'false'}>No</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type='primary' htmlType='submit'>
              {!this.editPage() ? 'Add Set' : 'Update Set'}
            </Button>
          </FormItem>
        </Form>
      </LoadingMessage>
    );
  }
}

export default MoveSetForm;
