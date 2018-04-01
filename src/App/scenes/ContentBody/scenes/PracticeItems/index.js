import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Divider, DatePicker, Button } from 'antd';
import PracticeItemForm from './components/PracticeItemForm';

const dateFormat = 'DD/MM/YYYY';

class PracticeItems extends Component {
  static propTypes = {
    removeAuthToken: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      dateString: moment().format(dateFormat)
    };
  }

  handleDateChange = (date, dateString) => {
    this.setState({ dateString });
  }

  render() {
    const {
      handleDateChange
    } = this;

    const {
      removeAuthToken
    } = this.props;

    const {
      dateString
    } = this.state;

    const practiceItemFormProps = {
      removeAuthToken,
      dateString
    };

    return (
      <div>
        <span className="title">Training Menu</span>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DatePicker value={dateString ? moment(dateString, dateFormat) : null} format={dateFormat} onChange={handleDateChange} />
          <Button type="primary" icon="plus-circle">Add</Button>
        </div>
        <PracticeItemForm {...practiceItemFormProps} />
      </div>
    )
  }
}

export default PracticeItems;
