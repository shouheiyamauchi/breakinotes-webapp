import { API_URL } from 'helpers/config';
import { sentenceCase } from 'helpers/functions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import { Form, Input, Select, Button } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class PracticeItemForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moveType: 'disabled',
      moves: [],
      move: 'disabled',
      notes: '',
      multimedia: [],
      uploading: new Map(),
    };
  }

  componentDidMount() {
    if (this.editItem()) {
      this.setState({ moveType: this.props.practiceItem.move.moveType }, () => {
        this.retrieveMoves(() => {
          this.setState({
            move: JSON.stringify({moveType: this.state.moveType, item: this.props.practiceItem.move.item._id}),
            notes: this.props.practiceItem.notes,
            multimedia: this.props.practiceItem.multimedia
          });
        });
      });
    };
  }

  editItem = () => {
    return !!this.props.practiceItem;
  }

  retrieveMoves = callback => {
    if (this.state.moveType !== 'disabled') {
      const resourceName = this.state.moveType[0].toLowerCase() + this.state.moveType.substr(1) + 's';

      axios.get(API_URL + resourceName, {
        headers: {
          Authorization: 'JWT ' + localStorage.getItem('breakinotes')
        }
      })
        .then((response) => {
          this.setState({ moves: response.data }, () => {
            if (callback) callback();
          });
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
    this.setState({ [name]: value }, () => {
      if (name === 'moveType') this.retrieveMoves();
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    this.editItem() ? this.updatePracticeItem() : this.submitNewPracticeItem();
  }

  submitNewPracticeItem = () => {
    axios.post(API_URL + 'practiceItems', qs.stringify({
      date: this.props.dateString,
      move: this.state.move,
      notes: this.state.notes,
      multimedia: JSON.stringify(this.state.multimedia),
      completed: false
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.props.appendNewPracticeItem(response.data);
        this.props.changeEditing('');
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  updatePracticeItem = () => {
    axios.put(API_URL + 'practiceItems/' + this.props.practiceItem._id, qs.stringify({
      date: this.props.dateString,
      move: this.state.move,
      notes: this.state.notes,
      multimedia: JSON.stringify(this.state.multimedia),
      completed: this.props.practiceItem.completed
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.props.updatePracticeItem(response.data);
        this.props.changeEditing('');
      })
      .catch((error) => {
        this.props.removeAuthToken();
      });
  }

  render() {
    const {
      handleSubmit,
      handleSelectChange,
      handleInputChange
    } = this;

    const {
      moves,
      moveType,
      move,
      notes
    } = this.state;

    const moveOptions = moves.map((move, index) => {
      return <Option value={JSON.stringify({moveType: this.state.moveType, item: move._id})} key={index}>
        {(move.type ? sentenceCase(move.type) + ' - ' : '') + move.name}
      </Option>
    });

    return (
      <Form onSubmit={handleSubmit} layout='vertical'>
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
            <Option value="MoveSet">Sets</Option>
          </Select>
        </FormItem>
        <FormItem label='Move'>
          <Select
            showSearch
            value={move}
            onChange={value => handleSelectChange(value, 'move')}
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <Option value="disabled" disabled>Select the move</Option>
            {moveOptions}
          </Select>
        </FormItem>
        <FormItem label='Notes'>
          <TextArea placeholder="Add some notes" rows={4} name='notes' value={notes} onChange={handleInputChange} />
        </FormItem>
        <FormItem>
          <Button type='primary' htmlType='submit'>
            {!this.editItem() ? 'Add Practice Item' : 'Update Practice Item'}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

PracticeItemForm.propTypes = {
  removeAuthToken: PropTypes.func.isRequired,
  practiceItem: PropTypes.object,
  dateString: PropTypes.string,
  changeEditing: PropTypes.func.isRequired,
  appendNewPracticeItem: PropTypes.func,
  updatePracticeItem: PropTypes.func
}

export default PracticeItemForm;
