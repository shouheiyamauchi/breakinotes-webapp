import React from 'react';
import MoveForm from '../../components/MoveForm';

const CloneMove = props => {
  return (
    <MoveForm id={props.match.params.id} removeAuthToken={props.removeAuthToken} clone={true} />
  );
}

export default CloneMove;
