import React, { Component } from 'react';
import PracticeItems from '../PracticeItems';
import Untouched from '../Untouched';

class Home extends Component {
  render() {
    return (
      <div>
        <PracticeItems removeAuthToken={this.props.removeAuthToken} />
        <div className="vertical-spacer" />
        <div className="vertical-spacer" />
        <Untouched removeAuthToken={this.props.removeAuthToken} />
      </div>
    );
  }
}

export default Home;
