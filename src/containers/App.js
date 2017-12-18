import { config } from '../config'
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import HomePage from './HomePage';

class App extends Component {
  render() {
    return (
      <Router>
          <div>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/topics">Topics</Link></li>
            </ul>
            <p>{config.API_URL}</p>

            <Route exact path="/" component={HomePage}/>
            <Route path="/about" component={HomePage}/>
            <Route path="/topics" component={HomePage}/>
          </div>
      </Router>
    );
  }
}

export default App;
