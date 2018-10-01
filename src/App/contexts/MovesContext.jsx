import update from 'immutability-helper'
import React, { Component } from 'react'

const MovesContext = React.createContext('')

export class MovesContextProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filteredMoves: {},
      moveFrames: [],
      moves: [],
      moveSets: [],
      setFilteredMoves: this.setFilteredMoves,
      setFrames: this.setFrames,
      setMoves: this.setMoves,
      setMoveSets: this.setMoveSets
    }
  }

  componentWillMount() {
    const { filteredMoves, moveFrames, moves } = JSON.parse(localStorage.getItem('breakinotesCache')) || {}

    this.setState({
      filteredMoves: filteredMoves || {},
      moveFrames: moveFrames || [],
      moves: moves || []
    })
  }

  updateCache = () => {
    const { filteredMoves, moveFrames, moves, moveSets } = this.state

    localStorage.setItem('breakinotesCache', JSON.stringify({
      filteredMoves, moveFrames, moves, moveSets
    }))
  }

  setFilteredMoves = (filterParam, filteredMoves, cb = () => {}) => {
    this.setState({ filteredMoves: update(this.state.filteredMoves, { [filterParam]: { $set: filteredMoves }}) }, () => {
      this.updateCache()
      cb()
    })
  }

  setFrames = (moveFrames, cb = () => {}) => {
    this.setState({ moveFrames }, () => {
      this.updateCache()
      cb()
    })
  }

  setMoves = (moves, cb = () => {}) => {
    this.setState({ moves }, () => {
      this.updateCache()
      cb()
    })
  }

  setMoveSets = (moveSets, cb = () => {}) => {
    this.setState({ moveSets }, () => {
      this.updateCache()
      cb()
    })
  }

  render() {
    return (
      <MovesContext.Provider value={this.state}>
        {this.props.children}
      </MovesContext.Provider>
    )
  }
}

const MovesContextConsumer = MovesContext.Consumer

export const withMovesContext = (Component) => (props) => (
  <MovesContextConsumer>
    {(context) => <Component {...context} {...props} />}
  </MovesContextConsumer>
)
