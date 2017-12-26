import { config } from '../config'
import { moveTypeColors, moveTypeShortNames } from '../constants'
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import _ from 'lodash';
import { Avatar, List } from 'antd';

class MovesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moves: [],
      redirect: false,
      redirectUrl: ''
    };

    this.getMoves = this.getMoves.bind(this);
    this.redirectToUrl = this.redirectToUrl.bind(this);
  };

  componentDidMount() {
    this.getMoves();
  }

  getMoves() {
    axios.get(config.API_URL + 'moves')
      .then((response) => {
        this.setState({moves: response.data});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  redirectToUrl(url) {
    this.setState({redirect: true});
    this.setState({redirectUrl: url})
  }

  render() {
    return (
      <div>
        {this.state.redirect ? <Redirect to={this.state.redirectUrl} /> : null}
        <List
          itemLayout="vertical"
          dataSource={this.state.moves}
          renderItem={move => (
            <List.Item>
              <div className="vertical-align" onClick={() => this.redirectToUrl('/move/' + move._id)}>
                <Avatar size="large" style={{ backgroundColor: moveTypeColors[move.type] }}>{moveTypeShortNames[move.type]}</Avatar>
                <div className="horizontal-spacer" />
                <div style={{lineHeight:"125%"}}>
                  <span className="list-title">{move.name}</span>
                  <br />
                  <span>{_.capitalize(move.origin)} {_.capitalize(move.type)}</span>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default MovesList;
