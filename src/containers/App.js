import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import { Layout, Menu, Icon, Card } from 'antd';
import MovesList from './MovesList';
import Move from './Move';
import About from './About';

const { Header, Content, Affix } = Layout;

class App extends Component {
  state = {
  current: 'mail',
}
handleClick = (e) => {
  console.log('click ', e);
  this.setState({
    current: e.key,
  });
}
  render() {
    return (
      <Router>
        <Layout>
            <Header style={{height: '46px', position: 'fixed', width: '100%', paddingLeft: '5px', zIndex: '1' }}>
              <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode='horizontal'
                theme='dark'
              >
                <Menu.SubMenu title={<span><Icon type='ant-design' />BreakiNotes</span>}>
                  <Menu.ItemGroup title='General'>
                    <Menu.Item key='1'>
                      <Link to='/'><Icon type='user' />Home</Link>
                    </Menu.Item>
                    <Menu.Item key='2'>
                      <Link to='/about'><Icon type='question-circle-o' />About</Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title='Reports'>
                    <Menu.Item key='setting:3'>
                      <Icon type='fast-forward' />Option 3
                    </Menu.Item>
                    <Menu.Item key='setting:4'>
                      <Icon type='area-chart' />Option 4
                    </Menu.Item>
                  </Menu.ItemGroup>
                </Menu.SubMenu>
              </Menu>
            </Header>
          <Content style={{ padding: 24, minHeight: 'calc(100vh - 46px)', marginTop: 46 }}>
            <Card style={{ width: '100%', minHeight: 'calc(100vh - 94px)' }}>
              <Route exact path='/' component={MovesList}/>
              <Route path='/about' component={About}/>
              <Route path='/move' component={Move}/>
            </Card>
          </Content>
        </Layout>
      </Router>
    );
  }
}

export default App;
