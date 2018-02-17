import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout, Card, Affix, Button, Icon } from 'antd';
import Login from './Login';
import NavMenu from './NavMenu';
import TransitionContainer from './TransitionContainer';
import Home from './Home';
import Moves from './Moves';
import MoveFrames from './MoveFrames';
import NewMove from './NewMove';
import NewMoveFrame from './NewMoveFrame';
import Filter from './Filter';
import Move from './Move';
import MoveFrame from './MoveFrame';
import EditMove from './EditMove';
import EditMoveFrame from './EditMoveFrame';
import RedirectPage from './RedirectPage';

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
              <Content style={{ padding: 24, minHeight: 'calc(100vh - 46px)', marginTop: 46 }}>
                <Card style={{ width: '100%', minHeight: 'calc(100vh - 94px)' }}>
                  <Switch>
                    <Route exact path="/" render={routerParams => <TransitionContainer><Home {...routerParams} removeAuthToken={this.removeAuthToken} /></TransitionContainer>}/>
                    <Route exact path="/moves" render={routerParams => <TransitionContainer><Moves {...routerParams} removeAuthToken={this.removeAuthToken} /></TransitionContainer>}/>
                    <Route exact path="/moves/new" render={routerParams => <TransitionContainer><NewMove {...routerParams} removeAuthToken={this.removeAuthToken} /></TransitionContainer>}/>
                    <Route exact path="/moves/filter" render={routerParams => <TransitionContainer><Filter {...routerParams} removeAuthToken={this.removeAuthToken} /></TransitionContainer>}/>
                    <Route path="/moves/edit/:id" render={routerParams => <TransitionContainer><EditMove {...routerParams} removeAuthToken={this.removeAuthToken} /></TransitionContainer>}/>
                    <Route path="/moves/redirect/:id" render={routerParams => <TransitionContainer><RedirectPage {...routerParams} type={'moves'} removeAuthToken={this.removeAuthToken} /></TransitionContainer>}/>
                    <Route path="/moves/:id" render={routerParams => <TransitionContainer><Move {...routerParams} removeAuthToken={this.removeAuthToken} /></TransitionContainer>}/>
                    <Route exact path="/moveFrames/" render={routerParams => <TransitionContainer><MoveFrames {...routerParams} removeAuthToken={this.removeAuthToken} /></TransitionContainer>}/>
                    <Route exact path="/moveFrames/new" render={routerParams => <TransitionContainer><NewMoveFrame {...routerParams} removeAuthToken={this.removeAuthToken} /></TransitionContainer>}/>
                    <Route path="/moveFrames/edit/:id" render={routerParams => <TransitionContainer><EditMoveFrame {...routerParams} removeAuthToken={this.removeAuthToken} /></TransitionContainer>}/>
                    <Route path="/moveFrames/redirect/:id" render={routerParams => <TransitionContainer><RedirectPage {...routerParams} type={'moveFrames'} removeAuthToken={this.removeAuthToken} /></TransitionContainer>}/>
                    <Route path="/moveFrames/:id" render={routerParams => <TransitionContainer><MoveFrame {...routerParams} removeAuthToken={this.removeAuthToken} /></TransitionContainer>}/>
                  </Switch>
                </Card>
              </Content>
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
