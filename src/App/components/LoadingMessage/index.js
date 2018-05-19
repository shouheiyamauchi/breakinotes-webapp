import React from 'react';
import { Spin } from 'antd';
import TransitionContainer from '../TransitionContainer';

const LoadingMessage = props => {
  return (
    <TransitionContainer key={props.loading}>
      {props.loading ? (
        <div className="align-center">
          <div className="vertical-spacer" />
          <div className="vertical-spacer" />
          <Spin />
          <br/>Loading...
        </div>
      ) : (
        <div>
          {props.children}
        </div>
      )}
    </TransitionContainer>
  );
}

export default LoadingMessage;
