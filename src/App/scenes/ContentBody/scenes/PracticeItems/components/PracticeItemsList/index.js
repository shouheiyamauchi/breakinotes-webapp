import { moveTypeColors, moveTypeShortNames } from 'helpers/constants';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { List, Avatar, Switch, Icon, Button } from 'antd';
import LoadingMessage from 'App/components/LoadingMessage';
import styles from './styles.module.scss';
import PracticeItemForm from '../PracticeItemForm';

const PracticeItemsList = props => {
  const {
    loading,
    practiceItems,
    toggleComplete,
    editing,
    practiceItemFormProps,
    changeEditing,
    updatePracticeItem
  } = props;

  return (
    <div>
      {loading ? (
        <LoadingMessage />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={practiceItems}
          renderItem={practiceItem => (
            <List.Item>
              {editing === practiceItem._id ? (
                <PracticeItemForm {...practiceItemFormProps} practiceItem={practiceItem} updatePracticeItem={updatePracticeItem} />
              ) : (
                <div className={practiceItem.completed ? styles.completed : styles.incomplete}>
                  <div className="vertical-align">
                    <Avatar size="large" style={{ backgroundColor: moveTypeColors[practiceItem.move.moveType] }}>{moveTypeShortNames[practiceItem.move.moveType]}</Avatar>
                    <div className="horizontal-spacer" />
                    <div style={{ lineHeight: '125%' }}>
                      <Link to={{ pathname: '/' + practiceItem.move.moveType[0].toLowerCase() + practiceItem.move.moveType.substr(1) + 's/redirect/' + practiceItem.move.item._id }}>
                        <span className="list-title">{practiceItem.move.item.name}</span>
                      </Link>
                      <br />
                      <span>{practiceItem.notes}</span>
                    </div>
                  </div>
                  <div className="vertical-spacer" />
                  <div className="align-right">
                    <div style={{ float: 'left' }}>
                      <Button type="dashed" size="small" onClick={() => changeEditing(practiceItem._id)}>Edit</Button>
                      &nbsp;
                      <Button type="danger" size="small" onClick={() => console.log('delete')}>Delete</Button>
                    </div>
                    <div style={{ float: 'right' }}>
                      <Switch checked={practiceItem.completed} onChange={() => toggleComplete(practiceItem._id)} disabled={practiceItem.loading} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
                    </div>
                    <div style={{ clear: 'both' }} />
                  </div>
                </div>
              )}
            </List.Item>
          )}
        />
      )}
    </div>
  );
}

PracticeItemsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  editing: PropTypes.string,
  practiceItems: PropTypes.array.isRequired,
  toggleComplete: PropTypes.func.isRequired,
  practiceItemFormProps: PropTypes.object.isRequired,
  changeEditing: PropTypes.func.isRequired,
  updatePracticeItem: PropTypes.func.isRequired
}

export default PracticeItemsList;
