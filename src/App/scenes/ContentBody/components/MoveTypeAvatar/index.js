import { moveTypeColors, moveTypeShortNames } from 'helpers/constants';
import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';

const MoveTypeAvatar = props => {
  return (
    <div className="avatar-div">
      <Avatar size="large" style={{ backgroundColor: moveTypeColors[props.move.type] }}>{moveTypeShortNames[props.move.type]}</Avatar>
    </div>
  );
}

MoveTypeAvatar.propTypes = {
  move: PropTypes.object
}

export default MoveTypeAvatar;
