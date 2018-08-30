import React from 'react';
import PropTypes from 'prop-types';

const Notes = props => {
  return (
    <div>
      {props.text.split('\n').map((string, index) => string.trim() ? <div key={index} className="word-wrap">{string}</div> : <br key={index} />)}
    </div>
  );
}

Notes.propTypes = {
  text: PropTypes.string
}

export default Notes;
