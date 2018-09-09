import React from 'react';
import PropTypes from 'prop-types';
import MoveTag from '../MoveTag';
import { Icon } from 'antd';
import styles from './styles.module.scss';

const SetTags = props => {
  return (
    <div className={styles.container}>
      {props.moves.map((move, index) => {
        return (
          <div key={index} className={styles.container}>
            <div>
              <MoveTag type={move.type} move={move.move} key={index} closable={props.closable} onClose={e => props.onClose(e, index)} removeAuthToken={props.removeAuthToken} />
              {props.edit && (
                <div className={styles['arrows-container']}>
                  <Icon className={index === 0 ? styles.disabled : styles.clickable} onClick={() => props.onLeftClick(index)} type="left-circle" theme="outlined" />
                  <Icon className={index + 1 === props.moves.length ? styles.disabled : styles.clickable} onClick={() => props.onRightClick(index)} type="right-circle" theme="outlined" />
                </div>
              )}
            </div>
            {index + 1 !== props.moves.length && (
              <div className="vertical-align">
                <Icon type="caret-right" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

SetTags.propTypes = {
  moves: PropTypes.array.isRequired,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  edit: PropTypes.bool
}

SetTags.defaultProps = {
  closable: false,
  onLeftClick: () => {},
  onRightClick: () => {}
}

export default SetTags;
