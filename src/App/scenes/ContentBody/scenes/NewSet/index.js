import React from 'react';
import SetForm from '../../components/SetForm';

const NewSet = props => {
  return (
    <SetForm removeAuthToken={props.removeAuthToken} />
  );
}

export default NewSet;
