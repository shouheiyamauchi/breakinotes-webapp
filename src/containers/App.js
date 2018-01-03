import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout, Card } from 'antd';
import NavMenu from './NavMenu';
import Home from './Home';
import NewMove from './NewMove';
import Filter from './Filter';
import Move from './Move';

const { Header, Content } = Layout;

class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
            <Header className="vertical-align" style={{height: '46px', position: 'fixed', width: '100%', paddingLeft: '20px', zIndex: '1' }}>
              <NavMenu />
            </Header>
          <Content style={{ padding: 24, minHeight: 'calc(100vh - 46px)', marginTop: 46 }}>
            <Card style={{ width: '100%', minHeight: 'calc(100vh - 94px)' }}>
              <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/newmove" component={NewMove}/>
                <Route path="/filter" component={Filter}/>
                <Route path="/move/:id" component={Move}/>
              </Switch>
            </Card>
          </Content>
        </Layout>
      </Router>
    );
  }
}

export default App;
