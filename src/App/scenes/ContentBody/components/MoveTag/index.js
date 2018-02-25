import { moveTypeColors } from 'helpers/constants'
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { Tag } from 'antd';

const MoveTag = props => {
  const {
    move,
    closable,
    onClose,
    type
  } = props;

  return (
    <Tag color={moveTypeColors[move.type]} closable={closable} onClose={onClose}>
      <Link to={{ pathname: '/' + type + '/redirect/' + move._id }}>{move.name}</Link>
    </Tag>
  );
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
