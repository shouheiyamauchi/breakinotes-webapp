import React, { Component } from 'react';
import isImage from 'is-image';
import isVideo from 'is-video';

const MultimediaDisplay = props => {
  if (isImage(props.fileName)) {
    return (
      <div className="align-center">
        <img src={props.multimediaUrl} />
      </div>
    )
  } else if (isVideo(props.fileName)) {
    return <div>Video</div>
  } else {
    return <div>Unsupported File Type</div>
  }
}

export default MultimediaDisplay;
