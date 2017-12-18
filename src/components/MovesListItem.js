import React, { Component } from 'react';
import { ListItem } from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class MovesListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Edit"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />,
    ];

    return (
      <div>
        <ListItem primaryText={this.props.move.name} onClick={this.handleOpen} />
        <Dialog
          title="Move Information"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          The actions in this window were passed in as an array of React objects.
        </Dialog>
      </div>
    );
  }
}

export default MovesListItem;
