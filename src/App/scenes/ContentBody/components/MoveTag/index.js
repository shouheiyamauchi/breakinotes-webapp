import { moveTypeColors } from 'helpers/constants'
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { Tag } from 'antd';

const MoveTag = props => {
  return (
    <Tag color={moveTypeColors[props.move.type]} closable={props.closable} onClose={props.onClose}>
      <Link to={{ pathname: '/' + props.type + '/redirect/' + props.move._id }}>{props.move.name}</Link>
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
