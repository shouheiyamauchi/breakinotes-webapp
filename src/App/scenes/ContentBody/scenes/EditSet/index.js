import React from 'react';
import SetForm from '../../components/SetForm';

const EditSet = props => {
  return (
    <SetForm id={props.match.params.id} removeAuthToken={props.removeAuthToken} />
  );
}

export default EditSet;
