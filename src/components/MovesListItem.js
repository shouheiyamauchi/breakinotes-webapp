import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class MovesListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  };

  render() {

    return (
      <div>
        <Link to={{ pathname: '/move', state: { move: this.props.move} }}>{this.props.move.name}</Link>
      </div>
    );
  }
}

export default MovesListItem;
