import React from 'react';
import PropTypes from 'prop-types';
import MoveTag from './MoveTag';

const MoveTags = props => {
  return (
    <div>
      {props.moves.map((move, index) => {
        return <MoveTag move={move} key={index} closable={props.closable} onClose={props.onClose} />;
      })}
    </div>
  );
}

MoveTags.propTypes = {
  moves: PropTypes.array
}

export default MoveTags;
