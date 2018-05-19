import React from 'react';
import MoveSetForm from '../../components/MoveSetForm';

const NewMoveSet = props => {
  return (
    <MoveSetForm removeAuthToken={props.removeAuthToken} />
  );
}

export default NewMoveSet;
