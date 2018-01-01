import { config } from '../config'
import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import _ from 'lodash';
import { Modal, Button, Form, Input, Select, Tag } from 'antd';
import MovesList from './MovesList.js'
import MoveTag from '../components/MoveTag';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

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
      notes: '',
      startingPosition: null,
      endingPositions: [],
      parentMove: null,
      childMoves: []
    };
  }

  componentDidMount() {
    this.getAllMoves();

    const urlParams = qs.parse(this.props.location.search.substr(1));
    this.setState({
      name: urlParams.name,
      origin: urlParams.origin,
      type: urlParams.type,
      notes: urlParams.notes,
      startingPosition: (urlParams.startingPosition) ? urlParams.startingPosition : null,
      endingPositions: (urlParams.endingPositions) ? urlParams.endingPositions : [],
      parentMove: (urlParams.parentMove) ? urlParams.parentMove : null,
      childMoves: (urlParams.childMoves) ? urlParams.childMoves : []
    }, () => {
      this.getFilteredMoves();
    });
  }

  getAllMoves = () => {
    axios.get(config.API_URL + 'moves')
      .then((response) => {
        this.setState({allMoves: response.data});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getFilteredMoves = () => {
    axios.post(config.API_URL + 'moves/filter', qs.stringify({
      name: this.state.name,
      origin: this.state.origin,
      type: this.state.type,
      notes: this.state.notes,
      startingPosition: this.state.startingPosition,
      endingPositions: (this.state.endingPositions.length > 0) ? JSON.stringify(this.state.endingPositions) : null,
      parentMove: this.state.parentMove,
      childMoves: (this.state.childMoves > 0) ? JSON.stringify(this.state.childMoves) : null
    }))
      .then((response) => {
        const filters = {
          name: this.state.name,
          origin: this.state.origin,
          type: this.state.type,
          notes: this.state.notes,
          startingPosition: this.state.startingPosition ? this.state.startingPosition : null,
          endingPositions: this.state.endingPositions,
          parentMove: this.state.parentMove ? this.state.parentMove : null,
          childMoves: this.state.childMoves
        };

        for (const filterType in filters) {
          if (!filters[filterType] || filters[filterType].length === 0) {
            delete filters[filterType];
          };
        };

        const paramString = qs.stringify(filters);
        if (paramString) {
          window.history.replaceState('', '', '/filter?' + paramString);
        } else {
          window.history.replaceState('', '', '/filter');
        };

        this.setState({
          filteredMoves: response.data,
          filterModalVisible: false
        });
      })
      .catch((error) => {
        console.log(error);
      });
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

  removeMoveFromArray = (e, id, state) => {
    e.preventDefault();
    this.setState({[state]: this.state[state].filter(move => move._id !== id)});
  }

  handleOk = e => {
    console.log(e);
    this.setState({
      filterModalVisible: false,
    });
  }

  handleCancel = e => {
    console.log(e);
    this.setState({
      filterModalVisible: false,
    });
  }

  render() {
    const validStartingEndingPosition = move => {
      return (move.type === 'position' || move.type === 'freeze' || move.type ==='powermove');
    }

    const startingPositionOptions = this.state.allMoves.map((move, index) => {
      if (validStartingEndingPosition(move) && (this.state.startingPosition === null || this.state.startingPosition._id !== move._id)) {
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

    const endingPositionsTags = this.state.endingPositions.map((move, index) => {
      return <MoveTag move={move} closable={true} onClose={(e) => this.removeMoveFromArray(e, move._id, 'endingPositions')} key={index} />;
    })

    const parentMoveOptions = this.state.allMoves.map((move, index) => {
      if (this.state.parentMove === null || this.state.parentMove._id !== move._id) {
        return <Option value={move._id} key={index}>{_.capitalize(move.type) + ' - ' + move.name}</Option>;
      };
      return null;
    })

    const childMovesOptions = this.state.allMoves.map((move, index) => {
      if (this.state.childMoves.length === 0 || this.state.childMoves.findIndex(childMove => childMove._id === move._id) === -1) {
        return <Option value={move._id} key={index}>{_.capitalize(move.type) + ' - ' + move.name}</Option>;
      };
      return null;
    })

    const childMovesTags = this.state.childMoves.map((move, index) => {
      return <MoveTag move={move} closable={true} onClose={(e) => this.removeMoveFromArray(e, move._id, 'childMoves')} key={index} />;
    })

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>Open</Button>
        <Modal
          title="Apply Filters"
          visible={this.state.filterModalVisible}
          onOk={this.getFilteredMoves}
          onCancel={this.handleCancel}
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
                (this.state.startingPosition === null) ?
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
                endingPositionsTags
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
                (this.state.parentMove === null) ?
                <Tag>Select a move from above</Tag> :
                <MoveTag move={this.state.parentMove} closable={true} onClose={(e) => this.clearSingleMove(e, 'parentMove')} />
              }
            </FormItem>
            <FormItem>
              <Select
                showSearch
                placeholder='Child Moves'
                value='disabled'
                onSelect={(value) => this.addMoveToArray(value, 'childMoves')}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value='disabled' disabled>Child Moves</Option>
                {childMovesOptions}
              </Select>
              {
                (this.state.childMoves.length === 0) ?
                <Tag>Select moves from above</Tag> :
                childMovesTags
              }
            </FormItem>
          </Form>
        </Modal>
        <MovesList moves={this.state.filteredMoves} deleteMove={this.deleteMove} />
      </div>
    );
  }
}

export default Filter;
