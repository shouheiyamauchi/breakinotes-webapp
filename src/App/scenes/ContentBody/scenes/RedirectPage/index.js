import React from 'react';
import { Redirect } from 'react-router-dom'

const RedirectPage = props => {
  return <Redirect to={'/' + props.type + '/' + props.match.params.id} />
}

export default RedirectPage;
