import React from 'react';
import PropTypes from 'prop-types';
import MoveTag from '../MoveTag';

const MoveTags = props => {
  return (
    <div>
      {props.moves.map((move, index) => {
        return <MoveTag type={props.type} move={move} key={index} closable={props.closable} onClose={props.onClose} removeAuthToken={props.removeAuthToken} />;
      })}
    </div>
  );
}

MoveTags.propTypes = {
  moves: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  removeAuthToken: PropTypes.func
}

MoveTags.defaultProps = {
  closable: false
}

export default MoveTags;
