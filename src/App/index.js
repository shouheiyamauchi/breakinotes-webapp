import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout, Affix, Button, Icon } from 'antd';
import Login from './scenes/Login';
import NavMenu from './scenes/NavMenu';
import ContentBody from './scenes/ContentBody';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userToken: null
    };
  }

  componentWillMount() {
    this.updateLoggedInStatus();
  }

  updateLoggedInStatus = () => {
    this.setState({ userToken: localStorage.getItem('breakinotes') });
  }

  removeAuthToken = () => {
    localStorage.removeItem('breakinotes');
    this.updateLoggedInStatus();
  }

  render() {
    return (
      <Router>
        <Layout>
          {!this.state.userToken ? (
            <Login updateLoggedInStatus={this.updateLoggedInStatus} />
          ) : (
            <div>
              <NavMenu />
              <ContentBody removeAuthToken={this.removeAuthToken} />
              <Affix style={{position: 'fixed', bottom: '20px', right: '20px'}}>
                <Button.Group>
                  <Button type="dashed" onClick={() => window.history.back()}>
                    <Icon type="left" />
                  </Button>
                  <Button type="dashed" onClick={() => window.history.forward()}>
                    <Icon type="right" />
                  </Button>
                </Button.Group>
              </Affix>
            </div>
          )}
        </Layout>
      </Router>
    );
  }
}

export default App;
