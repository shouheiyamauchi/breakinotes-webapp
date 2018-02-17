import React from 'react';
import MoveForm from '../../components/MoveForm';

const NewMove = props => {
  return (
    <MoveForm removeAuthToken={props.removeAuthToken} />
  );
}

export default NewMove;
