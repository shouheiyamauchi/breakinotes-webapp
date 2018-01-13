import { config } from '../config'
import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import _ from 'lodash';
import { Affix, Modal, Button, Form, Input, Select, Tag } from 'antd';
import MovesList from './MovesList.js'
import MoveTag from '../components/MoveTag';
import MoveTags from '../components/MoveTags';

const FormItem = Form.Item;
const { Option } = Select;

class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allMoves: [],
      filteredMoves:[],
      filterModalVisible: false,
      name: '',
      origin: '',
      type: '',
      startingPositions: [],
      endingPositions: [],
      parentMove: '',
      loading: true
    };
  }

  componentDidMount() {
    const urlParams = qs.parse(this.props.location.search.substr(1));
    this.getAllMoves(urlParams);
  }

  getAllMoves = (urlParams) => {
    axios.get(config.API_URL + 'moves')
      .then((response) => {
        this.setState({allMoves: response.data}, () => {
          this.setState({
            name: urlParams.name,
            origin: urlParams.origin,
            type: urlParams.type,
            startingPositions: (urlParams.startingPositions) ? urlParams.startingPositions.map(moveId => this.state.allMoves.find(move => move._id === moveId)) : [],
            endingPositions: (urlParams.endingPositions) ? urlParams.endingPositions.map(moveId => this.state.allMoves.find(move => move._id === moveId)) : [],
            parentMove: (urlParams.parentMove) ? this.state.allMoves.find((move) => move._id === urlParams.parentMove) : '',
          }, () => {
            this.getFilteredMoves();
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getFilteredMoves = () => {
    this.setState({loading: true}, () => {
      axios.post(config.API_URL + 'moves/filter', qs.stringify({
        name: this.state.name,
        origin: this.state.origin,
        type: this.state.type,
        startingPosition: (this.state.startingPositions.length > 0) ? JSON.stringify(this.state.startingPositions) : null,
        endingPositions: (this.state.endingPositions.length > 0) ? JSON.stringify(this.state.endingPositions) : null,
        parentMove: this.state.parentMove,
      }))
        .then((response) => {
          this.updateUrl();

          this.setState({
            filteredMoves: response.data,
            filterModalVisible: false,
            loading: false
          });
        })
        .catch((error) => {
          console.log(error);
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
      parentMove: this.state.parentMove ? this.state.parentMove._id : null,
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
    axios.delete(config.API_URL + 'moves/' + id)
      .then((response) => {
        this.getFilteredMoves();
        return
      })
      .catch((error) => {
        console.log(error);
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
    const validStartingEndingPosition = move => {
      return (move.type === 'position' || move.type === 'freeze' || move.type ==='powermove');
    }

    const startingPositionsOptions = this.state.allMoves.map((move, index) => {
      if (validStartingEndingPosition(move) && (this.state.startingPositions.length === 0 || this.state.startingPositions.findIndex(startingPosition => startingPosition._id === move._id) === -1)) {
        return <Option value={move._id} key={index}>{_.capitalize(move.type) + ' - ' + move.name}</Option>;
      };
      return null;
    })

    const endingPositionsOptions = this.state.allMoves.map((move, index) => {
      if (validStartingEndingPosition(move) && (this.state.endingPositions.length === 0 || this.state.endingPositions.findIndex(endingPosition => endingPosition._id === move._id) === -1)) {
        return <Option value={move._id} key={index}>{_.capitalize(move.type) + ' - ' + move.name}</Option>;
      };
      return null;
    })

    const parentMoveOptions = this.state.allMoves.map((move, index) => {
      if (!this.state.parentMove || this.state.parentMove._id !== move._id) {
        return <Option value={move._id} key={index}>{_.capitalize(move.type) + ' - ' + move.name}</Option>;
      };
      return null;
    })

    return (
      <div>
        <Affix offsetTop={75} style={{ position: 'absolute', right: -15}}>
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
                <Option value="position">Position</Option>
              </Select>
            </FormItem>
            <div className="ant-form-item-label">
              <label>Transitions</label>
            </div>
            <FormItem>
              <Select
                showSearch
                placeholder='Starting Positions'
                value='disabled'
                onSelect={(value) => this.addMoveToArray(value, 'startingPositions')}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value='disabled' disabled>Starting Positions</Option>
                {startingPositionsOptions}
              </Select>
              {
                (this.state.startingPositions.length === 0) ?
                <Tag>Select moves from above</Tag> :
                <MoveTags moves={this.state.startingPositions} closable={true} onClose={(e) => this.removeMoveFromArray(e, 'startingPositions')} />
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
          </Form>
        </Modal>

        <MovesList moves={this.state.filteredMoves} deleteMove={this.deleteMove} loading={this.state.loading} />
      </div>
    );
  }
}

export default Filter;
