import { API_URL } from 'helpers/config'
import { sentenceCase } from 'helpers/functions';
import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import { Affix, Modal, Button, Form, Input, Select, Tag } from 'antd';
import MovesList from './components/MovesList';
import MoveTag from '../../components/MoveTag';
import MoveTags from '../../components/MoveTags';

const FormItem = Form.Item;
const { Option } = Select;

class Moves extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allMoves: [],
      allFrames: [],
      filteredMoves:[],
      filterModalVisible: false,
      name: '',
      origin: '',
      type: '',
      startingPositions: [],
      endingPositions: [],
      parent: '',
      loading: true
    };
  }

  componentDidMount() {
    const urlParams = qs.parse(this.props.location.search.substr(1));
    this.getAllMoves(urlParams);
  }

  getAllMoves = (urlParams) => {
    axios.get(API_URL + 'moves', {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({allMoves: response.data}, () => {
          axios.get(API_URL + 'moveFrames', {
            headers: {
              Authorization: 'JWT ' + localStorage.getItem('breakinotes')
            }
          })
            .then((response) => {
              this.setState({
                allFrames: response.data
              }, () =>{
                this.setState({
                  name: urlParams.name,
                  origin: urlParams.origin,
                  type: urlParams.type,
                  startingPositions: (urlParams.startingPositions) ? urlParams.startingPositions.map(moveId => this.state.allFrames.find(move => move._id === moveId)) : [],
                  endingPositions: (urlParams.endingPositions) ? urlParams.endingPositions.map(moveId => this.state.allFrames.find(move => move._id === moveId)) : [],
                  parent: (urlParams.parent) ? this.state.allMoves.find((move) => move._id === urlParams.parent) : '',
                }, () => {
                  this.getFilteredMoves();
                });
              });
            });
        });
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  getFilteredMoves = () => {
    this.setState({loading: true}, () => {
      axios.post(API_URL + 'moves/filter', qs.stringify({
        name: this.state.name,
        origin: this.state.origin,
        type: this.state.type,
        startingPositions: (this.state.startingPositions.length > 0) ? JSON.stringify(this.state.startingPositions) : null,
        endingPositions: (this.state.endingPositions.length > 0) ? JSON.stringify(this.state.endingPositions) : null,
        parent: this.state.parent,
      }), {
        headers: {
          Authorization: 'JWT ' + localStorage.getItem('breakinotes')
        }
      })
        .then((response) => {
          this.updateUrl();

          this.setState({
            filteredMoves: response.data,
            filterModalVisible: false,
            loading: false
          });
        })
        .catch((error) => {
          this.props.removeAuthToken();
        });
    });
  }

  updateUrl = () => {
    const filters = {
      name: this.state.name,
      origin: this.state.origin,
      type: this.state.type,
      notes: this.state.notes,
      startingPositions: this.state.startingPositions.map(move => move._id),
      endingPositions: this.state.endingPositions.map(move => move._id),
      parent: this.state.parent ? this.state.parent._id : null,
    };

    for (const filterType in filters) {
      if (!filters[filterType] || filters[filterType].length === 0) {
        delete filters[filterType];
      };
    };

    const paramString = qs.stringify(filters);
    if (paramString) {
      window.history.replaceState('', '', '/moves/filter?' + paramString);
    } else {
      window.history.replaceState('', '', '/moves/filter');
    };
  }

  deleteMove = id => {
    axios.delete(API_URL + 'moves/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.getFilteredMoves();
        return
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  showModal = () => {
    this.setState({
      filterModalVisible: true,
    });
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

  addMoveToArray = (id, state) => {
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

  removeMoveFromArray = (e, state) => {
    e.preventDefault();
    const moveUrl = e.target.parentElement.childNodes[0].childNodes[0].href;
    const moveId = moveUrl.substr(moveUrl.lastIndexOf('/') + 1);

    this.setState({[state]: this.state[state].filter(move => move._id !== moveId)});
  }

  handleOk = e => {
    this.setState({
      filterModalVisible: false,
    });
  }

  handleCancel = e => {
    this.setState({
      filterModalVisible: false,
    });
  }

  render() {
    const startingPositionsOptions = this.state.allFrames.map((moveFrame, index) => {
      if (this.state.startingPositions.length === 0 || this.state.startingPositions.findIndex(startingPosition => startingPosition._id === moveFrame._id) === -1) {
        return <Option value={moveFrame._id} key={index}>{sentenceCase(moveFrame.type) + ' - ' + moveFrame.name}</Option>;
      };
      return null;
    })

    const endingPositionsOptions = this.state.allFrames.map((moveFrame, index) => {
      if (this.state.endingPositions.length === 0 || this.state.endingPositions.findIndex(endingPosition => endingPosition._id === moveFrame._id) === -1) {
        return <Option value={moveFrame._id} key={index}>{sentenceCase(moveFrame.type) + ' - ' + moveFrame.name}</Option>;
      };
      return null;
    })

    const parentOptions = this.state.allMoves.map((move, index) => {
      if (!this.state.parent || this.state.parent._id !== move._id) {
        return <Option value={move._id} key={index}>{sentenceCase(move.type) + ' - ' + move.name}</Option>;
      };
      return null;
    })

    return (
      <div>
        <Affix offsetTop={75} style={{position: 'absolute', right: '-15px'}}>
          <Button onClick={this.showModal} type="danger" shape="circle" icon="search" />
        </Affix>
        <Modal
          title="Apply Filters"
          style={{ top: 20 }}
          visible={this.state.filterModalVisible}
          onOk={this.getFilteredMoves}
          onCancel={this.handleCancel}
          okText="Filter"
        >
          <Form layout='vertical'>
            <FormItem label='Name'>
              <Input placeholder="Name of the move" name='name' value={this.state.name} onChange={this.handleInputChange} />
            </FormItem>
            <FormItem label='Origin'>
              <Select
                showSearch
                placeholder='Origin'
                value={this.state.origin}
                allowClear={true}
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
                allowClear={true}
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
              </Select>
            </FormItem>
            <div className="ant-form-item-label">
              <label>Transitions</label>
            </div>
            <FormItem>
              <Select
                showSearch
                placeholder='Starting Frames'
                value='disabled'
                onSelect={(value) => this.addMoveToArray(value, 'startingPositions')}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value='disabled' disabled>Starting Frames</Option>
                {startingPositionsOptions}
              </Select>
              {
                (this.state.startingPositions.length === 0) ?
                <Tag>Select moves from above</Tag> :
                <MoveTags type="moves" moves={this.state.startingPositions} closable={true} onClose={(e) => this.removeMoveFromArray(e, 'startingPositions')} />
              }
            </FormItem>
            <FormItem>
              <Select
                showSearch
                placeholder='Ending Frames'
                value='disabled'
                onSelect={(value) => this.addMoveToArray(value, 'endingPositions')}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value='disabled' disabled>Ending Frames</Option>
                {endingPositionsOptions}
              </Select>
              {
                (this.state.endingPositions.length === 0) ?
                <Tag>Select moves from above</Tag> :
                <MoveTags type="moves" moves={this.state.endingPositions} closable={true} onClose={(e) => this.removeMoveFromArray(e, 'endingPositions')} />
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
          </Form>
        </Modal>

        <MovesList moves={this.state.filteredMoves} deleteMove={this.deleteMove} loading={this.state.loading} />
      </div>
    );
  }
}

export default Moves;
