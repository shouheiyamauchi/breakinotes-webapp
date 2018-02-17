import { moveTypeColors, moveTypeShortNames } from 'helpers/constants';
import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';

const MoveTypeAvatar = props => {
  return (
    <Avatar size="large" style={{ backgroundColor: moveTypeColors[props.move.type] }}>{moveTypeShortNames[props.move.type]}</Avatar>
  );
}

MoveTypeAvatar.propTypes = {
  move: PropTypes.object
}

export default MoveTypeAvatar;
