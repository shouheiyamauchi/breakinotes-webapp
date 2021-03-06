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

class MoveFrame extends Component {
  constructor(props) {
    super(props)

    this.state = {
      moveFrame: {
        name: '',
        origin: '',
        type: '',
        notes: '',
        parent: '',
        childMoves: [],
        entries: [],
        exits: [],
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
    this.getMoveFrame(this.props.previewId || this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.previewId) this.getMoveFrame(nextProps.match.params.id)
  }

  getMoveFrame = id => {
    axios.get(API_URL + 'moveFrames/' + id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({
          moveFrame: response.data,
          loading: false
        })
      })
      .catch((error) => {
        this.props.removeAuthToken()
      })

    this.getPreviousPractice(id)
  }

  editMoveFrame = () => {
    this.setState({redirectUrl: '/moveFrames/edit/' + this.state.moveFrame._id})
  }

  cloneMoveFrame = () => {
    this.setState({redirectUrl: '/moveFrames/clone/' + this.state.moveFrame._id})
  }

  confirmDelete = () => {
    Modal.confirm({
      title: 'Confirm delete',
      content: 'Are you sure to delete "' + this.state.moveFrame.name + '"?',
      onOk: () => {
        this.deleteMoveFrame()
      },
      onCancel() {},
    })
  }

  deleteMoveFrame = () => {
    axios.delete(API_URL + 'moveFrames/' + this.state.moveFrame._id, {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({redirectUrl: '/moveFrames'})
      })
      .catch((error) => {
        this.props.removeAuthToken()
      })
  }

  getPreviousPractice = (id) => {
    axios.post(API_URL + 'practiceItems/filter', qs.stringify({
      move: JSON.stringify({ moveType: 'MoveFrame', item: id })
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
              <MoveTypeAvatar move={this.state.moveFrame} />
              <div className="horizontal-spacer" />
              <div className="right-content">
                {this.props.previewId ? (
                  <Link className="title" to={{ pathname: '/moveFrames/redirect/' + this.state.moveFrame._id }}>{this.state.moveFrame.name}</Link>
                ) : (
                  <span className="title">{this.state.moveFrame.name}</span>
                )}
                <br />
                <span>{sentenceCase(this.state.moveFrame.origin)} {sentenceCase(this.state.moveFrame.type)}</span>
                {this.state.moveFrame.draft && <span> (Draft)</span>}
              </div>
            </div>
            <div className="vertical-spacer" />
            {!this.props.previewId && (
              <div>
                <div className="align-right">
                  <Button type="dashed" size="small" onClick={this.editMoveFrame}>Edit</Button>
                  &nbsp;
                  <Button type="primary" size="small" onClick={this.cloneMoveFrame}>Clone</Button>
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
                <h3>Entry Moves</h3>
                {!this.state.moveFrame.entries.length ? <Tag>None</Tag> : <MoveTags type="moves" moves={this.state.moveFrame.entries} removeAuthToken={this.props.removeAuthToken} />}
              </div>
              <Divider />
              <div>
                <h3>Exit Moves</h3>
                {!this.state.moveFrame.exits.length ? <Tag>None</Tag> : <MoveTags type="moves" moves={this.state.moveFrame.exits} removeAuthToken={this.props.removeAuthToken} />}
              </div>
            </div>
            <Divider />
            <div>
              <h3>Parent Frame</h3>
              {!this.state.moveFrame.parent ? <Tag>None</Tag> : <MoveTag type="moveFrames" move={this.state.moveFrame.parent} removeAuthToken={this.props.removeAuthToken} /> }
            </div>
            <Divider />
            <div>
              <h3>Child Frames</h3>
              {!this.state.moveFrame.childMoves.length ? <Tag>None</Tag> : <MoveTags type="moveFrames" moves={this.state.moveFrame.childMoves} removeAuthToken={this.props.removeAuthToken} />}
            </div>
            <Divider />
            <div>
              <h3>Multimedia</h3>
              {!this.state.moveFrame.multimedia.length ? <Tag>None</Tag> : <MultimediaTags multimedia={this.state.moveFrame.multimedia} />}
            </div>
            <Divider />
            <div>
              <h3>Notes</h3>
              {!this.state.moveFrame.notes ? 'None' : <Notes text={this.state.moveFrame.notes} />}
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

export default MoveFrame
