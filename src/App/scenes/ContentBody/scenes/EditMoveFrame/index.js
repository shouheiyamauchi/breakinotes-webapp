import React from 'react';
import MoveFrameForm from '../../components/MoveFrameForm';

const EditMoveFrame = props => {
  return (
    <MoveFrameForm id={props.match.params.id} removeAuthToken={props.removeAuthToken} />
  );
}

export default EditMoveFrame;
