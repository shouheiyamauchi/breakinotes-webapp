import React from 'react';
import PropTypes from 'prop-types';
import MultimediaTag from './MultimediaTag';

const MultimediaTags = props => {
  return (
    <div>
      {props.multimedia.map((multimedia, index) => {
        return <MultimediaTag multimedia={multimedia} key={index} closable={props.closable} onClose={(e) => props.onClose(e, multimedia)} />;
      })}
    </div>
  );
}

MultimediaTags.propTypes = {
  multimedia: PropTypes.array,
  closable: PropTypes.bool,
  onClose: PropTypes.func
}

MultimediaTags.defaultProps = {
  closable: false
}

export default MultimediaTags;
