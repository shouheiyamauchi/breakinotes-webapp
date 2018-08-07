import React from 'react';
import MoveFrameForm from '../../components/MoveFrameForm';

const CloneMoveFrame = props => {
  return (
    <MoveFrameForm id={props.match.params.id} removeAuthToken={props.removeAuthToken} clone={true} />
  );
}

export default CloneMoveFrame;
