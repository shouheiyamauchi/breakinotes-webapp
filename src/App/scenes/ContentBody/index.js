import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout, Card } from 'antd';
import TransitionContainer from 'App/components/TransitionContainer';
import Home from './scenes/Home';
import MoveFrames from './scenes/MoveFrames';
import NewMove from './scenes/NewMove';
import NewMoveFrame from './scenes/NewMoveFrame';
import NewMoveSet from './scenes/NewMoveSet';
import Moves from './scenes/Moves';
import Move from './scenes/Move';
import MoveSet from './scenes/MoveSet';
import MoveSets from './scenes/MoveSets';
import MoveFrame from './scenes/MoveFrame';
import EditMove from './scenes/EditMove';
import EditMoveFrame from './scenes/EditMoveFrame';
import EditMoveSet from './scenes/EditMoveSet';
import CloneMove from './scenes/CloneMove';
import CloneMoveFrame from './scenes/CloneMoveFrame';
import CloneMoveSet from './scenes/CloneMoveSet';
import PracticeItems from './scenes/PracticeItems';
import RedirectPage from './scenes/RedirectPage';

const { Content } = Layout;

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/moves/new',
    component: NewMove
  },
  {
    path: '/moves/filter',
    component: Moves
  },
  {
    path: '/moves/edit/:id',
    component: EditMove
  },
  {
    path: '/moves/clone/:id',
    component: CloneMove
  },
  {
    path: '/moves/redirect/:id',
    component: RedirectPage,
    extraProps: { type: 'moves' }
  },
  {
    path: '/moves/:id',
    component: Move
  },
  {
    path: '/moveFrames',
    component: MoveFrames
  },
  {
    path: '/moveFrames/new',
    component: NewMoveFrame
  },
  {
    path: '/moveFrames/edit/:id',
    component: EditMoveFrame
  },
  {
    path: '/moveFrames/clone/:id',
    component: CloneMoveFrame
  },
  {
    path: '/moveSets/new',
    component: NewMoveSet
  },
  {
    path: '/moveSets',
    component: MoveSets
  },
  {
    path: '/moveSets/:id',
    component: MoveSet
  },
  {
    path: '/moveSets/edit/:id',
    component: EditMoveSet
  },
  {
    path: '/moveSets/clone/:id',
    component: CloneMoveSet
  },
  {
    path: '/moveFrames/redirect/:id',
    component: RedirectPage,
    extraProps: { type: 'moveFrames' }
  },
  {
    path: '/moveFrames/:id',
    component: MoveFrame
  },
  {
    path: '/practiceItems',
    component: PracticeItems
  },
]

class ContentBody extends Component {
  generateAllRoutes = routeObjects => {
    return routeObjects.map((routeObject, index) => this.generateRoute(index, routeObject.component, routeObject.path, routeObject.extraProps))
  }

  generateRoute = (key, Component, path, extraProps) => {
    return <Route key={key} exact path={path} render={routerParams => <Component {...routerParams} removeAuthToken={this.props.removeAuthToken} {...extraProps} />}/>
  }

  render() {
    const {
      path
    } = this.props

    return (
      <Content style={{ padding: 24, minHeight: 'calc(100vh - 46px)', marginTop: 46 }}>
        <Card style={{ width: '100%', minHeight: 'calc(100vh - 94px)' }}>
          <TransitionContainer key={path}>
            <Switch>
              {this.generateAllRoutes(routes)}
            </Switch>
          </TransitionContainer>
        </Card>
      </Content>
    );
  }
}

export default ContentBody;
