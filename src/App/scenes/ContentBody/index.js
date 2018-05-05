import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout, Card } from 'antd';
import TransitionContainer from './scenes/TransitionContainer';
import Home from './scenes/Home';
import MoveFrames from './scenes/MoveFrames';
import NewMove from './scenes/NewMove';
import NewMoveFrame from './scenes/NewMoveFrame';
import Moves from './scenes/Moves';
import Move from './scenes/Move';
import MoveFrame from './scenes/MoveFrame';
import EditMove from './scenes/EditMove';
import EditMoveFrame from './scenes/EditMoveFrame';
import PracticeItems from './scenes/PracticeItems';
import RedirectPage from './scenes/RedirectPage';

const { Content } = Layout;

const ContentBody = props => {
  return (
    <Content style={{ padding: 24, minHeight: 'calc(100vh - 46px)', marginTop: 46 }}>
      <Card style={{ width: '100%', minHeight: 'calc(100vh - 94px)' }}>
        <TransitionContainer key={props.path}>
          <Switch>
            <Route exact path="/" render={routerParams => <Home {...routerParams} removeAuthToken={props.removeAuthToken} />}/>
            <Route exact path="/moves/new" render={routerParams => <NewMove {...routerParams} removeAuthToken={props.removeAuthToken} />}/>
            <Route exact path="/moves/filter" render={routerParams => <Moves {...routerParams} removeAuthToken={props.removeAuthToken} />}/>
            <Route exact path="/moves/edit/:id" render={routerParams => <EditMove {...routerParams} removeAuthToken={props.removeAuthToken} />}/>
            <Route exact path="/moves/redirect/:id" render={routerParams => <RedirectPage {...routerParams} type={'moves'} removeAuthToken={props.removeAuthToken} />}/>
            <Route exact path="/moves/:id" render={routerParams => <Move {...routerParams} removeAuthToken={props.removeAuthToken} />}/>
            <Route exact path="/moveFrames/" render={routerParams => <MoveFrames {...routerParams} removeAuthToken={props.removeAuthToken} />}/>
            <Route exact path="/moveFrames/new" render={routerParams => <NewMoveFrame {...routerParams} removeAuthToken={props.removeAuthToken} />}/>
            <Route exact path="/moveFrames/edit/:id" render={routerParams => <EditMoveFrame {...routerParams} removeAuthToken={props.removeAuthToken} />}/>
            <Route exact path="/moveFrames/redirect/:id" render={routerParams => <RedirectPage {...routerParams} type={'moveFrames'} removeAuthToken={props.removeAuthToken} />}/>
            <Route exact path="/moveFrames/:id" render={routerParams => <MoveFrame {...routerParams} removeAuthToken={props.removeAuthToken} />}/>
            <Route exact path="/practiceItems/" render={routerParams => <PracticeItems {...routerParams} removeAuthToken={props.removeAuthToken} />}/>
          </Switch>
        </TransitionContainer>
      </Card>
    </Content>
  );
}

export default ContentBody;
