import { config } from '../config'
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import qs from 'qs';
import _ from 'lodash';
import { Divider, Form, Input, Icon, Select, Upload, Progress, Button, Tag } from 'antd';
import MoveTag from '../components/MoveTag';
import MoveTags from '../components/MoveTags';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class MoveForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moves: [],
      name: '',
      origin: 'disabled',
      type: 'disabled',
      notes: '',
      startingPosition: '',
      endingPositions: [],
      parentMove: '',
      multimedia: [],
      redirect: false,
      redirectUrl: '',
      uploading: []
    };
  }

  componentDidMount() {
    if (this.editPage()) this.getMove(this.props.id); // edit page will have the move id as prop
    this.getMoves();
  }

  editPage = () => {
    return this.props.id
  }

  getMoves = () => {
    axios.get(config.API_URL + 'moves')
      .then((response) => {
        this.setState({moves: response.data});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getMove = id => {
    axios.get(config.API_URL + 'moves/' + id)
      .then((response) => {
        this.setState({
          name: response.data.name,
          origin: response.data.origin,
          type: response.data.type,
          notes: response.data.notes,
          startingPosition: response.data.startingPosition,
          endingPositions: response.data.endingPositions,
          parentMove: response.data.parentMove,
          multimedia: response.data.multimedia
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  setSingleMove = (id, state) => {
    axios.get(config.API_URL + 'moves/' + id)
      .then((response) => {
        this.setState({[state]: response.data});
      })
      .catch((error) => {
        console.log(error);
      })
  }

  clearSingleMove = (e, state) => {
    e.preventDefault();
    this.setState({[state]: null});
  }

  addMoveToArray = (id, state) => {
    axios.get(config.API_URL + 'moves/' + id)
      .then((response) => {
        this.setState({[state]: [...this.state[state], response.data]});
      })
      .catch((error) => {
        console.log(error);
      })
  }

  removeMoveFromArray = (e, state) => {
    e.preventDefault();
    const moveUrl = e.target.parentElement.childNodes[0].childNodes[0].href;
    const moveId = moveUrl.substr(moveUrl.lastIndexOf('/') + 1);

    this.setState({[state]: this.state[state].filter(move => move._id !== moveId)});
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

    !this.editPage() ? this.postNewMove() : this.updateMove()
  }

  postNewMove = () => {
    axios.post(config.API_URL + 'moves', qs.stringify({
      name: this.state.name,
      origin: this.state.origin,
      type: this.state.type,
      notes: this.state.notes,
      startingPosition: (this.state.startingPosition) ? this.state.startingPosition._id : null,
      endingPositions: JSON.stringify(this.state.endingPositions.map(move => move._id)),
      parentMove: (this.state.parentMove) ? this.state.parentMove._id : null,
      multimedia: JSON.stringify(this.state.multimedia)
    }))
      .then((response) => {
        this.redirectToUrl('/moves/' + response.data._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateMove = () => {
    axios.put(config.API_URL + 'moves/' + this.props.id, qs.stringify({
      name: this.state.name,
      origin: this.state.origin,
      type: this.state.type,
      notes: this.state.notes,
      startingPosition: (this.state.startingPosition) ? this.state.startingPosition._id : null,
      endingPositions: JSON.stringify(this.state.endingPositions.map(move => move._id)),
      parentMove: (this.state.parentMove) ? this.state.parentMove._id : null,
      multimedia: JSON.stringify(this.state.multimedia)
    }))
      .then((response) => {
        this.redirectToUrl('/moves/' + response.data._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  redirectToUrl = url => {
    this.setState({redirect: true});
    this.setState({redirectUrl: url});
  }

  getSignedRequestAndUpload = file => {
    axios.post(config.API_URL + 's3/signed-url', qs.stringify({
      fileName: file.uid + '/' + file.name,
      fileType: file.type
    }))
      .then((response) => {
        this.uploadFile(file, response.data.signedRequest, response.data.url);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  uploadFile = (file, signedRequest, url) => {
    this.setState({
      uploading: [...this.state.uploading,
        {
          name: file.name,
          value: file.uid + '/' + file.name,
          status: 0
        }
      ]
    })

    const options = {
      headers: {
        'Content-Type': file.type
      },
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round(progressEvent.loaded / progressEvent.total * 100);
        const uploading = this.state.uploading;
        const indexOnList = uploading.findIndex(fileObject => fileObject.value === (file.uid + '/' + file.name));
        uploading[indexOnList].status = percentCompleted
        this.setState({ uploading });
      }
    };

    axios.put(signedRequest, file, options)
      .then((response) => {
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

  render() {
    const validStartingEndingPosition = move => {
      return (move.type === 'position' || move.type === 'freeze' || move.type ==='powermove');
    }

    const startingPositionOptions = this.state.moves.map((move, index) => {
      if (validStartingEndingPosition(move) && (!this.state.startingPosition || this.state.startingPosition._id !== move._id)) {
        return <Option value={move._id} key={index}>{_.capitalize(move.type) + ' - ' + move.name}</Option>;
      };
      return null;
    })

    const endingPositionsOptions = this.state.moves.map((move, index) => {
      if (validStartingEndingPosition(move) && (this.state.endingPositions.length === 0 || this.state.endingPositions.findIndex(endingPosition => endingPosition._id === move._id) === -1)) {
        return <Option value={move._id} key={index}>{_.capitalize(move.type) + ' - ' + move.name}</Option>;
      };
      return null;
    })

    const parentMoveOptions = this.state.moves.map((move, index) => {
      if (!this.state.parentMove || this.state.parentMove._id !== move._id) {
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

    const uploadProgress = this.state.uploading.map((file, index) => {
      return (
        <div key={index}>
          {file.name}
          <Progress percent={file.status} status={file.status === 100 ? "success" : "active"} />
        </div>
      )
    })

    return (
      <div>
        {this.state.redirect ? <Redirect push to={this.state.redirectUrl} /> : null}
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
              <Option value="freeze">Freeze</Option>
              <Option value="position">Position</Option>
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
              placeholder='Starting Position'
              value='disabled'
              onSelect={(value) => this.setSingleMove(value, 'startingPosition')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value='disabled' disabled>Starting Position</Option>
              {startingPositionOptions}
            </Select>
            {
              (!this.state.startingPosition) ?
              <Tag>Select a move from above</Tag> :
              <MoveTag move={this.state.startingPosition} closable={true} onClose={(e) => this.clearSingleMove(e, 'startingPosition')} />
            }
          </FormItem>
          <FormItem>
            <Select
              showSearch
              placeholder='Ending Positions'
              value='disabled'
              onSelect={(value) => this.addMoveToArray(value, 'endingPositions')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value='disabled' disabled>Ending Positions</Option>
              {endingPositionsOptions}
            </Select>
            {
              (this.state.endingPositions.length === 0) ?
              <Tag>Select moves from above</Tag> :
              <MoveTags moves={this.state.endingPositions} closable={true} onClose={(e) => this.removeMoveFromArray(e, 'endingPositions')} />
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
              onSelect={(value) => this.setSingleMove(value, 'parentMove')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value='disabled' disabled>Parent Move</Option>
              {parentMoveOptions}
            </Select>
            {
              (!this.state.parentMove) ?
              <Tag>Select a move from above</Tag> :
              <MoveTag move={this.state.parentMove} closable={true} onClose={(e) => this.clearSingleMove(e, 'parentMove')} />
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