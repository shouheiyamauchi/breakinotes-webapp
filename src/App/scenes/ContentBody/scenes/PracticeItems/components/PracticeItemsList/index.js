import React, { Component } from 'react';
import update from 'immutability-helper'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { List, Switch, Icon, Button, Modal } from 'antd';
import LoadingMessage from 'App/components/LoadingMessage';
import styles from './styles.module.scss';
import PracticeItemForm from '../PracticeItemForm';
import Move from '../../../Move'
import MoveFrame from '../../../MoveFrame'
import MoveSet from '../../../MoveSet'
import MoveTypeAvatar from '../../../../components/MoveTypeAvatar'
import Notes from '../../../../components/Notes'

class PracticeItemsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previewModalVisible: {}
    }
  }

  toggleModal = (id) => {
    this.setState({
      previewModalVisible: update(this.state.previewModalVisible, { [id]: { $set: !this.state.previewModalVisible[id] }})
    })
  }

  generateMovePreview = (type, id) => {
    const props = {
      previewId: id,
      removeAuthToken: this.props.removeAuthToken
    }

    switch (type) {
      case 'Move':
        return <Move {...props} />
      case 'MoveFrame':
        return <MoveFrame {...props} />
      case 'MoveSet':
        return <MoveSet {...props} />
      default:
        return null;
    }
  }

  render() {
    const {
      loading,
      practiceItems,
      toggleComplete,
      editing,
      practiceItemFormProps,
      changeEditing,
      updatePracticeItem,
      confirmDelete
    } = this.props;

    return (
      <LoadingMessage loading={loading}>
        {!loading && (
          <List
            itemLayout="vertical"
            dataSource={practiceItems}
            renderItem={practiceItem => (
              <List.Item>
                {editing === practiceItem._id ? (
                  <PracticeItemForm {...practiceItemFormProps} practiceItem={practiceItem} updatePracticeItem={updatePracticeItem} />
                ) : (
                  <div>
                    <div className={'vertical-align ' + (practiceItem.completed ? styles.completed : styles.incomplete)}>
                      <MoveTypeAvatar move={{ type: practiceItem.move.moveType }} />
                      <div className="horizontal-spacer" />
                      <div className="right-content">
                        <span className="list-title clickable" onClick={() => this.toggleModal(practiceItem._id)}>{practiceItem.move.item.name}</span>
                        <Modal
                          visible={this.state.previewModalVisible[practiceItem._id]}
                          onCancel={() => this.toggleModal(practiceItem._id)}
                          footer={<Link to={{ pathname: '/' + practiceItem.move.moveType[0].toLowerCase() + practiceItem.move.moveType.substr(1) + 's/redirect/' + practiceItem.move.item._id }}><Button size="small">Open Full Page</Button></Link>}
                        >
                          {this.generateMovePreview(practiceItem.move.moveType, practiceItem.move.item._id)}
                        </Modal>
                        <br />
                        <Notes text={practiceItem.notes} />
                      </div>
                    </div>
                    <div className="vertical-spacer" />
                    <div className="align-right">
                      <div style={{ float: 'left' }}>
                        <Button type="dashed" size="small" onClick={() => changeEditing(practiceItem._id)}>Edit</Button>
                        &nbsp;
                        <Button type="danger" size="small" onClick={() => confirmDelete(practiceItem._id)}>Delete</Button>
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
      </LoadingMessage>
    );
  }
}

PracticeItemsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  editing: PropTypes.string,
  practiceItems: PropTypes.array.isRequired,
  toggleComplete: PropTypes.func.isRequired,
  practiceItemFormProps: PropTypes.object.isRequired,
  changeEditing: PropTypes.func.isRequired,
  updatePracticeItem: PropTypes.func.isRequired,
  removeAuthToken: PropTypes.func.isRequired
}

export default PracticeItemsList;
