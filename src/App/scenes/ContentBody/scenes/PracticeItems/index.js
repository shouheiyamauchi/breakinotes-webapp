import { API_URL } from 'helpers/config'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import moment from 'moment';
import axios from 'axios';
import qs from 'qs';
import { Divider, DatePicker, Button } from 'antd';
import TransitionContainer from 'App/components/TransitionContainer';
import PracticeItemForm from './components/PracticeItemForm';
import PracticeItemsList from './components/PracticeItemsList';

const dateFormat = 'DD/MM/YYYY';

class PracticeItems extends Component {
  static propTypes = {
    removeAuthToken: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      dateString: moment().format(dateFormat),
      practiceItems: [],
      loading: true,
      editing: ''
    };
  }

  componentDidMount() {
    this.getFilteredPracticeItems();
  }

  handleDateChange = (date, dateString) => {
    this.setState({ dateString }, () => {
      this.getFilteredPracticeItems();
    });
  }

  changeEditing = id => {
    this.setState({ editing: id });
  }

  getFilteredPracticeItems = () => {
    if (!this.state.dateString) {
      this.setState({ practiceItems: [] });
    } else {
      this.setState({ loading: true }, () => {
        axios.post(API_URL + 'practiceItems/filter', qs.stringify({
          startDate: this.state.dateString,
          endDate: this.state.dateString
        }), {
          headers: {
            Authorization: 'JWT ' + localStorage.getItem('breakinotes')
          }
        })
          .then((response) => {
            this.setState({
              practiceItems: response.data,
              loading: false
            });
          })
          .catch((error) => {
            this.props.removeAuthToken();
          });
      });
    };
  }

  appendNewPracticeItem = practiceItem => {
    this.setState(update(this.state, { practiceItems: { $push: [practiceItem] }}));
  }

  toggleComplete = id => {
    const practiceItemIndex = this.getPracticeItemIndex(id);
    this.setState(update(this.state, { practiceItems: { [practiceItemIndex]: { loading: {$set: true }}}}), () => {
      axios.post(API_URL + 'practiceItems/toggle', qs.stringify({
        id
      }), {
        headers: {
          Authorization: 'JWT ' + localStorage.getItem('breakinotes')
        }
      })
        .then((response) => {
          this.updatePracticeItem(response.data);
        })
        .catch((error) => {
          this.props.removeAuthToken();
        });
    });
  }

  updatePracticeItem = practiceItem => {
    const practiceItemIndex = this.getPracticeItemIndex(practiceItem._id);

    this.setState(update(this.state, { practiceItems: { [practiceItemIndex]: { $set: practiceItem }}}));
  }

  getPracticeItemIndex = id => {
    return this.state.practiceItems.findIndex(practiceItem => practiceItem._id === id);
  }

  render() {
    const {
      handleDateChange,
      changeEditing,
      toggleComplete,
      appendNewPracticeItem,
      updatePracticeItem
    } = this;

    const {
      removeAuthToken
    } = this.props;

    const {
      dateString,
      practiceItems,
      editing,
      loading
    } = this.state;

    const practiceItemFormProps = {
      removeAuthToken,
      dateString,
      changeEditing
    };

    const practiceItemsListProps = {
      loading,
      practiceItems,
      toggleComplete,
      editing,
      practiceItemFormProps,
      changeEditing,
      updatePracticeItem
    };

    return (
      <div>
        <span className="title">Training Menu</span>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DatePicker value={dateString ? moment(dateString, dateFormat) : null} format={dateFormat} onChange={handleDateChange} />
          {editing === 'new' ? (
            <Button type="default" icon="close-circle" onClick={() => changeEditing('')}>Cancel</Button>
          ) : (
            <Button type="primary" icon="plus-circle" onClick={() => changeEditing('new')}>Add</Button>
          )}
        </div>
        <br />
        <TransitionContainer key={editing}>
          {editing === 'new' && <PracticeItemForm {...practiceItemFormProps} appendNewPracticeItem={appendNewPracticeItem} />}
        </TransitionContainer>
        <div>
          <PracticeItemsList {...practiceItemsListProps} />
        </div>
      </div>
    );
  }
}

export default PracticeItems;
