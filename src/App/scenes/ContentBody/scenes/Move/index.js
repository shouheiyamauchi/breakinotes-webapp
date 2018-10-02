import { API_URL } from 'helpers/config'
import { sentenceCase } from 'helpers/functions'
import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import qs from 'qs'
import { Tag, Divider, Button, Modal } from 'antd'
import MoveTypeAvatar from '../../components/MoveTypeAvatar'
import MoveTag from '../../components/MoveTag'
import MoveTags from '../../components/MoveTags'
import MultimediaTags from '../../components/MultimediaTags'
import Notes from '../../components/Notes'
import PastPracticeItems from '../../components/PastPracticeItems'
import LoadingMessage from 'App/components/LoadingMessage'

class Move extends Component {
  constructor(props) {
    super(props)

    this.state = {
      move: {
        name: '',
        origin: '',
        type: '',
        notes: '',
        startingPositions: [],
        endingPositions: [],
        parent: '',
        childMoves: [],
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
    this.getMove(this.props.previewId || this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.previewId) this.getMove(nextProps.match.params.id)
  }

  getMove = id => {
    axios.get(API_URL + 'moves/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({
          move: response.data,
          loading: false
        })
      })
      .catch((error) => {
        this.props.removeAuthToken()
      })

    this.getPreviousPractice(id)
  }

  editMove = () => {
    this.setState({redirectUrl: '/moves/edit/' + this.state.move._id})
  }

  cloneMove = () => {
    this.setState({redirectUrl: '/moves/clone/' + this.state.move._id})
  }

  confirmDelete = () => {
    Modal.confirm({
      title: 'Confirm delete',
      content: 'Are you sure to delete "' + this.state.move.name + '"?',
      onOk: () => {
        this.deleteMove()
      },
      onCancel() {},
    })
  }

  deleteMove = () => {
    axios.delete(API_URL + 'moves/' + this.state.move._id, {
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
      move: JSON.stringify({ moveType: 'Move', item: id })
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

    return (
      <LoadingMessage loading={loading}>
        {!loading && (
          <div>
            {this.state.redirectUrl ? <Redirect push to={this.state.redirectUrl} /> : null}
            <div className="vertical-align">
              <MoveTypeAvatar move={this.state.move} />
              <div className="horizontal-spacer" />
              <div className="right-content">
                {this.props.previewId ? (
                  <Link className="title" to={{ pathname: '/moves/redirect/' + this.state.move._id }}>{this.state.move.name}</Link>
                ) : (
                  <span className="title">{this.state.move.name}</span>
                )}
                <br />
                <span>{sentenceCase(this.state.move.origin)} {sentenceCase(this.state.move.type)}</span>
                {this.state.move.draft && <span> (Draft)</span>}
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
              <div>
                <h3>Starting Frames</h3>
                {!this.state.move.startingPositions.length ? <Tag>None</Tag> : <MoveTags type="moveFrames" moves={this.state.move.startingPositions} removeAuthToken={this.props.removeAuthToken} />}
              </div>
              <Divider />
              <div>
                <h3>Ending Frames</h3>
                {!this.state.move.endingPositions.length ? <Tag>None</Tag> : <MoveTags type="moveFrames" moves={this.state.move.endingPositions} removeAuthToken={this.props.removeAuthToken} />}
              </div>
            </div>
            <Divider />
            <div>
              <h3>Parent Move</h3>
              {!this.state.move.parent ? <Tag>None</Tag> : <MoveTag type="moves" move={this.state.move.parent} removeAuthToken={this.props.removeAuthToken} /> }
            </div>
            <Divider />
            <div>
              <h3>Child Moves</h3>
              {!this.state.move.childMoves.length ? <Tag>None</Tag> : <MoveTags type="moves" moves={this.state.move.childMoves} removeAuthToken={this.props.removeAuthToken} />}
            </div>
            <Divider />
            <div>
              <h3>Multimedia</h3>
              {!this.state.move.multimedia.length ? <Tag>None</Tag> : <MultimediaTags multimedia={this.state.move.multimedia} />}
            </div>
            <Divider />
            <div>
              <h3>Notes</h3>
              {!this.state.move.notes ? 'None' : <Notes text={this.state.move.notes} />}
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

export default Move
