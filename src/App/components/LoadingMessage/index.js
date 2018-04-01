import React from 'react';
import { Spin } from 'antd';

const LoadingMessage = () => {
  return (
    <div className="align-center">
      <div className="vertical-spacer" />
      <div className="vertical-spacer" />
      <Spin />
      <br/>Loading...
    </div>
  );
}

export default LoadingMessage;
