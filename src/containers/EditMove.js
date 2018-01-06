import React from 'react';
import MoveForm from './MoveForm';

const EditMove = props => {
  return (
    <MoveForm id={props.match.params.id} />
  );
}

export default EditMove;
