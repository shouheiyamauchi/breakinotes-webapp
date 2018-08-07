import React from 'react';
import MoveSetForm from '../../components/MoveSetForm';

const CloneMoveSet = props => {
  return (
    <MoveSetForm id={props.match.params.id} removeAuthToken={props.removeAuthToken} clone={true} />
  );
}

export default CloneMoveSet;
