import { API_URL } from 'helpers/config'
import { sentenceCase } from 'helpers/functions'
import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import qs from 'qs'
import { Tag, Divider, Button, Modal } from 'antd'
import MoveTypeAvatar from '../../components/MoveTypeAvatar'
import SetTags from '../../components/SetTags'
import MultimediaTags from '../../components/MultimediaTags'
import Notes from '../../components/Notes'
import PastPracticeItems from '../../components/PastPracticeItems'
import LoadingMessage from 'App/components/LoadingMessage'

class MoveSet extends Component {
  constructor(props) {
    super(props)

    this.state = {
      set: {
        name: '',
        type: '',
        moves: [],
        notes: '',
        multimedia: [],
        draft: true
      },
      redirectUrl: '',
      loading: true,
      pastPracticeItems: [],
      pastPracticeItemsPage: 1
    }
  }

  componentDidMount() {
    this.getSet(this.props.previewId || this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.previewId) this.getSet(nextProps.match.params.id)
  }

  getSet = id => {
    axios.get(API_URL + 'moveSets/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        const moves = response.data.moves.map(move => {
          return {
            item: move.item._id,
            moveType: move.moveType,
            name: move.item.name,
            type: move.item.type
          }
        })

        this.setState({
          set: { ...response.data, moves },
          loading: false
        })
      })
      .catch((error) => {
        this.props.removeAuthToken()
      })

    this.getPreviousPractice(id)
  }

  editMove = () => {
    this.setState({redirectUrl: '/moveSets/edit/' + this.state.set._id})
  }

  cloneMove = () => {
    this.setState({redirectUrl: '/moveSets/clone/' + this.state.set._id})
  }

  confirmDelete = () => {
    Modal.confirm({
      title: 'Confirm delete',
      content: 'Are you sure to delete "' + this.state.set.name + '"?',
      onOk: () => {
        this.deleteMove()
      },
      onCancel() {},
    })
  }

  deleteMove = () => {
    axios.delete(API_URL + 'moveSets/' + this.state.set._id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({redirectUrl: '/'})
      })
      .catch((error) => {
        this.props.removeAuthToken()
      })
  }

  getPreviousPractice = (id) => {
    axios.post(API_URL + 'practiceItems/filter', qs.stringify({
      move: JSON.stringify({ moveType: 'MoveSet', item: id })
    }), {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({ pastPracticeItems: response.data })
      })
      .catch((error) => {
        this.props.removeAuthToken()
      })
  }

  updatePreviousPracticePage = (page, pageSize) => {
    this.setState({ pastPracticeItemsPage: page })
  }

  render() {
    const {
      loading,
      pastPracticeItems,
      pastPracticeItemsPage
    } = this.state

    const moves = this.state.set.moves.map(move => {
      return {
        type: move.moveType[0].toLowerCase() + move.moveType.substr(1) + 's',
        move: {
          _id: move.item,
          type: move.type,
          name: move.name
        }
      }
    })

    return (
      <LoadingMessage loading={loading}>
        {!loading && (
          <div>
            {this.state.redirectUrl ? <Redirect push to={this.state.redirectUrl} /> : null}
            <div className="vertical-align">
              <MoveTypeAvatar move={{ type: 'set' }} />
              <div className="horizontal-spacer" />
              <div className="right-content">
                {this.props.previewId ? (
                  <Link className="title" to={{ pathname: '/moveSets/redirect/' + this.state.set._id }}>{this.state.set.name}</Link>
                ) : (
                  <span className="title">{this.state.set.name}</span>
                )}
                <br />
                <span>{sentenceCase(this.state.set.type)}</span>
                {this.state.set.draft && <span> (Draft)</span>}
              </div>
            </div>
            <div className="vertical-spacer" />
            {!this.props.previewId && (
              <div>
                <div className="align-right">
                  <Button type="dashed" size="small" onClick={this.editMove}>Edit</Button>
                  &nbsp;
                  <Button type="primary" size="small" onClick={this.cloneMove}>Clone</Button>
                  &nbsp;
                  <Button type="danger" size="small" onClick={this.confirmDelete}>Delete</Button>
                </div>
                <div className="vertical-spacer" />
              </div>
            )}
            <Divider />
            <div className="vertical-spacer" />
            <div>
              <h3>Set Moves</h3>
              {!moves.length ? <Tag>None</Tag> : <SetTags moves={moves} removeAuthToken={this.props.removeAuthToken} /> }
            </div>
            <Divider />
            <div>
              <h3>Multimedia</h3>
              {!this.state.set.multimedia.length ? <Tag>None</Tag> : <MultimediaTags multimedia={this.state.set.multimedia} />}
            </div>
            <Divider />
            <div>
              <h3>Notes</h3>
              {!this.state.set.notes ? 'None' : <Notes text={this.state.set.notes} />}
            </div>
            <Divider />
            <div>
              <h3>Past Practice Items</h3>
              <PastPracticeItems
                onPageChange={this.updatePreviousPracticePage}
                page={pastPracticeItemsPage}
                pastPracticeItems={pastPracticeItems}
              />
            </div>
          </div>
        )}
      </LoadingMessage>
    )
  }
}

export default MoveSet
