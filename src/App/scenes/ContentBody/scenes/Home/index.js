import React, { Component } from 'react';
import PracticeItems from '../PracticeItems';

class Home extends Component {
  render() {
    return (
      <div>
        <PracticeItems removeAuthToken={this.props.removeAuthToken} />
      </div>
    );
  }
}

export default Home;
