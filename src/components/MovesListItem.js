import React, { Component } from 'react';

class MovesListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  };

  render() {

    return (
      <div>
        {this.props.move.name}
      </div>
    );
  }
}

export default MovesListItem;
