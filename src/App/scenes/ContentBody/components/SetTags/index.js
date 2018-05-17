import React from 'react';
import PropTypes from 'prop-types';
import MoveTag from '../MoveTag';
import { Icon } from 'antd';

const SetTags = props => {
  return (
    <div>
      {props.moves.map((move, index) => {
        return (
          <div key={index} className="side-by-side">
            <MoveTag type={move.type} move={move.move} key={index} closable={props.closable} onClose={e => props.onClose(e, index)} />
            {index + 1 !== props.moves.length && <Icon type="caret-right" />}
          </div>
        );
      })}
    </div>
  );
}

SetTags.propTypes = {
  moves: PropTypes.array.isRequired,
  closable: PropTypes.bool,
  onClose: PropTypes.func
}

SetTags.defaultProps = {
  closable: false
}

export default SetTags;
