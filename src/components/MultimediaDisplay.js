import React from 'react';
import isImage from 'is-image';
import isVideo from 'is-video';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";

const MultimediaDisplay = props => {
  if (isImage(props.fileName) && props.visible) {
    return (
      <div className="align-center">
        <img alt="" src={props.multimediaUrl} />
      </div>
    )
  } else if (isVideo(props.fileName) && props.visible) {
    return (
      <Player>
        <source src={props.multimediaUrl} />
      </Player>
    )
  } else if (!props.visible) {
    return null;
  } else {
    return <div>Unsupported File Type</div>
  }
}

export default MultimediaDisplay;
