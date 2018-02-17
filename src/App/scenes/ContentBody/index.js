import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout, Card } from 'antd';
import TransitionContainer from './scenes/TransitionContainer';
import Home from './scenes/Home';
import Moves from './scenes/Moves';
import MoveFrames from './scenes/MoveFrames';
import NewMove from './scenes/NewMove';
import NewMoveFrame from './scenes/NewMoveFrame';
import Filter from './scenes/Filter';
import Move from './scenes/Move';
import MoveFrame from './scenes/MoveFrame';
import EditMove from './scenes/EditMove';
import EditMoveFrame from './scenes/EditMoveFrame';
import RedirectPage from './scenes/RedirectPage';

const { Content } = Layout;

const ContentBody = props => {
  return (
    <Content style={{ padding: 24, minHeight: 'calc(100vh - 46px)', marginTop: 46 }}>
      <Card style={{ width: '100%', minHeight: 'calc(100vh - 94px)' }}>
        <Switch>
          <Route exact path="/" render={routerParams => <TransitionContainer><Home {...routerParams} removeAuthToken={props.removeAuthToken} /></TransitionContainer>}/>
          <Route exact path="/moves" render={routerParams => <TransitionContainer><Moves {...routerParams} removeAuthToken={props.removeAuthToken} /></TransitionContainer>}/>
          <Route exact path="/moves/new" render={routerParams => <TransitionContainer><NewMove {...routerParams} removeAuthToken={props.removeAuthToken} /></TransitionContainer>}/>
          <Route exact path="/moves/filter" render={routerParams => <TransitionContainer><Filter {...routerParams} removeAuthToken={props.removeAuthToken} /></TransitionContainer>}/>
          <Route path="/moves/edit/:id" render={routerParams => <TransitionContainer><EditMove {...routerParams} removeAuthToken={props.removeAuthToken} /></TransitionContainer>}/>
          <Route path="/moves/redirect/:id" render={routerParams => <TransitionContainer><RedirectPage {...routerParams} type={'moves'} removeAuthToken={props.removeAuthToken} /></TransitionContainer>}/>
          <Route path="/moves/:id" render={routerParams => <TransitionContainer><Move {...routerParams} removeAuthToken={props.removeAuthToken} /></TransitionContainer>}/>
          <Route exact path="/moveFrames/" render={routerParams => <TransitionContainer><MoveFrames {...routerParams} removeAuthToken={props.removeAuthToken} /></TransitionContainer>}/>
          <Route exact path="/moveFrames/new" render={routerParams => <TransitionContainer><NewMoveFrame {...routerParams} removeAuthToken={props.removeAuthToken} /></TransitionContainer>}/>
          <Route path="/moveFrames/edit/:id" render={routerParams => <TransitionContainer><EditMoveFrame {...routerParams} removeAuthToken={props.removeAuthToken} /></TransitionContainer>}/>
          <Route path="/moveFrames/redirect/:id" render={routerParams => <TransitionContainer><RedirectPage {...routerParams} type={'moveFrames'} removeAuthToken={props.removeAuthToken} /></TransitionContainer>}/>
          <Route path="/moveFrames/:id" render={routerParams => <TransitionContainer><MoveFrame {...routerParams} removeAuthToken={props.removeAuthToken} /></TransitionContainer>}/>
        </Switch>
      </Card>
    </Content>
  );
}

export default ContentBody;
