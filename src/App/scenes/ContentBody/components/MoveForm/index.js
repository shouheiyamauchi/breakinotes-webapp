import { API_URL } from 'helpers/config'
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import qs from 'qs';
import _ from 'lodash';
import { Divider, Form, Input, Icon, Select, Upload, Progress, Button, Tag, Modal, Checkbox } from 'antd';
import MoveTag from '../MoveTag';
import MoveTags from '../MoveTags';
import MultimediaTags from 'App/components/MultimediaTags';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class MoveForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moves: [],
      moveFrames: [],
      name: '',
      origin: 'disabled',
      type: 'disabled',
      notes: '',
      startingPositions: [],
      endingPositions: [],
      parent: null,
      multimedia: [],
      draft: true,
      redirectUrl: '',
      uploading: new Map(),
      startingPositionSuggestions: [],
      endingPositionSuggestions: [],
      addedStartingPositions: [],
      addedEndingPositions: []
    };
  }

  componentDidMount() {
    if (this.editPage()) this.getMove(this.props.id); // edit page will have the move id as prop
    this.getMoves();
    this.getMoveFrames();
  }

  editPage = () => {
    return this.props.id
  }

  getMoves = () => {
    axios.get(API_URL + 'moves', {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({moves: response.data});
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
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

  getMove = id => {
    axios.get(API_URL + 'moves/' + id, {
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
          startingPositions: response.data.startingPositions,
          endingPositions: response.data.endingPositions,
          parent: response.data.parent,
          multimedia: response.data.multimedia,
          draft: response.data.draft
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  setSingleMove = (id, state) => {
    axios.get(API_URL + 'moves/' + id, {
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

  addMoveFrameToArray = (id, state) => {
    axios.get(API_URL + 'moveFrames/' + id, {
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

  removeMoveFrameFromArray = (e, state) => {
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

    axios.post(API_URL + 'moves/suggestions', qs.stringify({
      startingPositions: JSON.stringify(this.state.startingPositions.map(move => move._id)),
      endingPositions: JSON.stringify(this.state.endingPositions.map(move => move._id)),
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({
          startingPositionSuggestions: response.data.startingPositionSuggestions,
          endingPositionSuggestions: response.data.endingPositionSuggestions
        }, () => {
          if (this.state.startingPositionSuggestions.length + this.state.endingPositionSuggestions.length > 0) {
            this.displaySuggestionsModal();
          } else {
            !this.editPage() ? this.postNewMove() : this.updateMove();
          };
        });
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  displaySuggestionsModal = () => {
    Modal.confirm({
      title: 'Would you like to add to the starting and ending positions the following suggestions?',
      content: (
        <div>
          {this.state.startingPositionSuggestions.length === 0 ? (
            null
          ) : (
            <div>
              <div className="ant-form-item-label">
                <label>Starting Positions</label>
              </div>
              <Checkbox.Group options={this.state.startingPositionSuggestions.map(move => ({label: move.name, value: move._id}))} onChange={(selectedValues) => this.addExtraPositions(selectedValues, 'addedStartingPositions')} />
            </div>
          )}
          {this.state.endingPositionSuggestions.length === 0 ? (
            null
          ) : (
            <div>
              <div className="ant-form-item-label">
                <label>Ending Positions</label>
              </div>
              <Checkbox.Group options={this.state.endingPositionSuggestions.map(move => ({label: move.name, value: move._id}))} onChange={(selectedValues) => this.addExtraPositions(selectedValues, 'addedEndingPositions')} />
            </div>
          )}
        </div>
      ),
      onOk: () => {
        !this.editPage() ? this.postNewMove() : this.updateMove();
      },
      onCancel: () => {
        this.setState({
          addedStartingPositions: [],
          addedEndingPositions: []
        });
      },
    });
  }

  postNewMove = () => {
    axios.post(API_URL + 'moves', qs.stringify({
      name: this.state.name,
      origin: this.state.origin,
      type: this.state.type,
      notes: this.state.notes,
      startingPositions: JSON.stringify((this.state.startingPositions.map(move => move._id)).concat(this.state.addedStartingPositions)),
      endingPositions: JSON.stringify((this.state.endingPositions.map(move => move._id)).concat(this.state.addedEndingPositions)),
      parent: (this.state.parent) ? this.state.parent._id : null,
      multimedia: JSON.stringify(this.state.multimedia),
      draft: this.state.draft
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({redirectUrl: '/moves/' + response.data._id});
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  updateMove = () => {
    axios.put(API_URL + 'moves/' + this.props.id, qs.stringify({
      name: this.state.name,
      origin: this.state.origin,
      type: this.state.type,
      notes: this.state.notes,
      startingPositions: JSON.stringify((this.state.startingPositions.map(move => move._id)).concat(this.state.addedStartingPositions)),
      endingPositions: JSON.stringify((this.state.endingPositions.map(move => move._id)).concat(this.state.addedEndingPositions)),
      parent: (this.state.parent) ? this.state.parent._id : null,
      multimedia: JSON.stringify(this.state.multimedia),
      draft: this.state.draft
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({redirectUrl: '/moves/' + response.data._id});
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
    const startingFramesOptions = this.state.moveFrames.map((moveFrame, index) => {
      if (this.state.startingPositions.length === 0 || this.state.startingPositions.findIndex(startingPosition => startingPosition._id === moveFrame._id) === -1) {
        return <Option value={moveFrame._id} key={index}>{_.capitalize(moveFrame.type) + ' - ' + moveFrame.name}</Option>;
      };
      return null;
    })

    const endingFramesOptions = this.state.moveFrames.map((moveFrame, index) => {
      if (this.state.endingPositions.length === 0 || this.state.endingPositions.findIndex(endingPosition => endingPosition._id === moveFrame._id) === -1) {
        return <Option value={moveFrame._id} key={index}>{_.capitalize(moveFrame.type) + ' - ' + moveFrame.name}</Option>;
      };
      return null;
    })

    const parentOptions = this.state.moves.map((move, index) => {
      if (this.props.id !== move._id && (!this.state.parent || this.state.parent._id !== move._id)) {
        return <Option value={move._id} key={index}>{_.capitalize(move.type) + ' - ' + move.name}</Option>;
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
        <span className="title">{!this.editPage() ? 'Add New Move' : 'Edit Move'}</span>
        <Divider />
        <div className="vertical-spacer" />
        <Form onSubmit={this.handleSubmit} layout='vertical'>
          <FormItem label='Name'>
            <Input placeholder="Name of the move" name='name' value={this.state.name} onChange={this.handleInputChange} />
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
              <Option value="toprock">Toprock</Option>
              <Option value="rocking">Rocking</Option>
              <Option value="drop">Drop</Option>
              <Option value="footwork">Footwork</Option>
              <Option value="floorwork">Floorwork</Option>
              <Option value="backrock">Backrock</Option>
              <Option value="powermove">Powermove</Option>
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
            <label>Transitions</label>
          </div>
          <FormItem>
            <Select
              showSearch
              placeholder='Starting Frames'
              value='disabled'
              onSelect={(value) => this.addMoveFrameToArray(value, 'startingPositions')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value='disabled' disabled>Starting Frames</Option>
              {startingFramesOptions}
            </Select>
            {
              (this.state.startingPositions.length === 0) ?
              <Tag>Select moves from above</Tag> :
              <MoveTags type="moveFrames" moves={this.state.startingPositions} closable={true} onClose={(e) => this.removeMoveFrameFromArray(e, 'startingPositions')} />
            }
          </FormItem>
          <FormItem>
            <Select
              showSearch
              placeholder='Ending Frames'
              value='disabled'
              onSelect={(value) => this.addMoveFrameToArray(value, 'endingPositions')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value='disabled' disabled>Ending Frames</Option>
              {endingFramesOptions}
            </Select>
            {
              (this.state.endingPositions.length === 0) ?
              <Tag>Select moves from above</Tag> :
              <MoveTags type="moveFrames" moves={this.state.endingPositions} closable={true} onClose={(e) => this.removeMoveFrameFromArray(e, 'endingPositions')} />
            }
          </FormItem>
          <div className="ant-form-item-label">
            <label>Variations</label>
          </div>
          <FormItem>
            <Select
              showSearch
              placeholder='Parent Move'
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
              <MoveTag type="moves" move={this.state.parent} closable={true} onClose={(e) => this.clearSingleMove(e, 'parent')} />
            }
          </FormItem>
          <FormItem label='Draft'>
            <Select
              showSearch
              placeholder='Draft'
              value={this.state.draft}
              onChange={(value) => this.handleSelectChange(value, 'draft')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
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
