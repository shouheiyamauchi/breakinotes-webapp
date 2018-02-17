import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout, Card, Affix, Button, Icon } from 'antd';
import Login from './scenes/Login';
import NavMenu from './scenes/NavMenu';
import ContentBody from './scenes/ContentBody';

const { Header, Content } = Layout;

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
      <div>
        {!this.state.userToken ? (
          <Login updateLoggedInStatus={this.updateLoggedInStatus} />
        ) : (
          <Router>
            <Layout>
              <Header className="vertical-align" style={{height: '46px', position: 'fixed', width: '100%', paddingLeft: '20px', zIndex: '1' }}>
                <NavMenu />
              </Header>
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
            </Layout>
          </Router>
        )}
      </div>
    );
  }
}

export default App;
