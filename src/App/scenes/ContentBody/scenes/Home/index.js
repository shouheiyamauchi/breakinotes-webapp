import React, { Component } from 'react';
import PracticeItems from '../PracticeItems';
import Touched from '../Touched';

class Home extends Component {
  render() {
    return (
      <div>
        <PracticeItems removeAuthToken={this.props.removeAuthToken} />
        <div className="vertical-spacer" />
        <div className="vertical-spacer" />
        <Touched removeAuthToken={this.props.removeAuthToken} />
      </div>
    );
  }
}

export default Home;
