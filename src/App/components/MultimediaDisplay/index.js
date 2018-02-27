import React from 'react';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";

const MultimediaDisplay = props => {
  const isImage = (fileName) => {
    const extension = fileName.substr(fileName.lastIndexOf('.') + 1);
    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension.toLowerCase())
  }

  const isVideo = (fileName) => {
    const extension = fileName.substr(fileName.lastIndexOf('.') + 1);
    return ['mp4', 'mov', 'avi'].includes(extension.toLowerCase())
  }

  if (isImage(props.fileName) && props.visible) {
    return (
      <div className="align-center">
        <img alt="" src={props.multimediaUrl} style={{maxWidth: '100%'}} />
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
