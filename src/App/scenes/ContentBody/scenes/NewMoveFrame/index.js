import React from 'react';
import MoveFrameForm from '../../components/MoveFrameForm';

const NewMoveFrame = props => {
  return (
    <MoveFrameForm removeAuthToken={props.removeAuthToken} />
  );
}

export default NewMoveFrame;
