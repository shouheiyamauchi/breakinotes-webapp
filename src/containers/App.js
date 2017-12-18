import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import { Layout, Menu, Icon, Card } from 'antd';
import MovesList from './MovesList';
import About from './About';

const { Header, Footer, Sider, Content } = Layout;

class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
              <Menu.Item key="1">
                <Link to="/"><Icon type="user" />Home</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/about"><Icon type="question-circle-o" />About</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ padding: 24, minHeight: '100vh' }}>
              <Card style={{ width: '100%', minHeight: 'calc(100vh - 48px)' }}>
                <Route exact path="/" component={MovesList}/>
                <Route path="/about" component={About}/>
              </Card>
            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;
