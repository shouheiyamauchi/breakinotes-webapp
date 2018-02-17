import React from 'react';
import MoveForm from './MoveForm';

const NewMove = props => {
  return (
    <MoveForm removeAuthToken={props.removeAuthToken} />
  );
}

export default NewMove;
