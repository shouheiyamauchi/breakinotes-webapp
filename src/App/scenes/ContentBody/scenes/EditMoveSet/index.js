import React from 'react';
import MoveSetForm from '../../components/MoveSetForm';

const EditMoveSet = props => {
  return (
    <MoveSetForm id={props.match.params.id} removeAuthToken={props.removeAuthToken} />
  );
}

export default EditMoveSet;
