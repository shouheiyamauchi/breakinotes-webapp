import { moveTypeColors } from 'helpers/constants'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { Tag, Modal, Button } from 'antd';
import Move from '../../scenes/Move'
import MoveFrame from '../../scenes/MoveFrame'
import MoveSet from '../../scenes/MoveSet'

class MoveTag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previewModalVisible: false
    }
  }

  handleCancel = e => {
    this.setState({
      previewModalVisible: false,
    });
  }

  showModal = e => {
    this.setState({
      previewModalVisible: true,
    });
  }

  generateMovePreview = () => {
    const props = {
      previewId: this.props.move._id,
      removeAuthToken: this.props.removeAuthToken
    }

    switch (this.props.type) {
      case 'moves':
        return <Move {...props} />
      case 'moveFrames':
        return <MoveFrame {...props} />
      case 'moveSets':
        return <MoveSet {...props} />
      default:
        return null;
    }
  }

  render() {
    const {
      move,
      closable,
      onClose,
      type,
      removeAuthToken
    } = this.props;

    return (
      removeAuthToken ? (
        <Tag color={moveTypeColors[move.type]} closable={closable} onClose={onClose}>
          <span onClick={this.showModal}>{move.name}</span>
          <Modal
            visible={this.state.previewModalVisible}
            onCancel={this.handleCancel}
            footer={<Link to={{ pathname: '/' + type + '/redirect/' + move._id }}><Button size="small">Open Full Page</Button></Link>}
          >
            {this.generateMovePreview()}
          </Modal>
        </Tag>
      ) : (
        <Tag color={moveTypeColors[move.type]} closable={closable} onClose={onClose}>
          <Link to={{ pathname: '/' + type + '/redirect/' + move._id }}>{move.name}</Link>
        </Tag>
      )
    );
  }
}

MoveTag.propTypes = {
  move: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  closable: PropTypes.bool,
  onClose: PropTypes.func
}

MoveTag.defaultProps = {
  closable: false
}

export default MoveTag;
