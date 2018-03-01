import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Dropdown, Icon } from 'antd';

const { Header } = Layout;
const { SubMenu } = Menu;

const subMenuStyle = { marginRight: '5px' };

const menuItems = (
  <Menu>
    <Menu.Item key="home">
      <Link to="/"><Icon type="user" />Home</Link>
    </Menu.Item>
    <SubMenu key="moveFrames" title={<span><Icon type="plus-circle-o" style={subMenuStyle} />Add</span>}>
      <Menu.Item key="newMoveFrame">
        <Link to="/moveFrames/new"><Icon type="file" />New Frame</Link>
      </Menu.Item>
      <Menu.Item key="newMove">
        <Link to="/moves/new"><Icon type="file-text" />New Move</Link>
      </Menu.Item>
    </SubMenu>
    <Menu.Item key="listMoveFrames">
      <Link to="/moveFrames"><Icon type="bars" />Frames List</Link>
    </Menu.Item>
    <Menu.Item key="filter">
      <Link to="/moves/filter"><Icon type="bars" />Moves List</Link>
    </Menu.Item>
  </Menu>
);

const NavMenu = () => (
  <Header className="vertical-align" style={{height: '46px', position: 'fixed', width: '100%', paddingLeft: '20px', zIndex: '1' }}>
    <Dropdown overlay={menuItems} trigger={['click']}>
      <span className="menu-title"><Icon type="ant-design" style={{marginRight: '7px'}} />BreakiNotes</span>
    </Dropdown>
  </Header>
);

export default NavMenu;
