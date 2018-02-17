import React from 'react';
import MoveFrameForm from './MoveFrameForm';

const NewMoveFrame = props => {
  return (
    <MoveFrameForm removeAuthToken={props.removeAuthToken} />
  );
}

export default NewMoveFrame;
