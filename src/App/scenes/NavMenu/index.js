import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Dropdown, Icon } from 'antd';

const { Header } = Layout;
const { SubMenu } = Menu;

const menuItems = (
  <Menu>
    <Menu.Item key="home">
      <Link to="/"><Icon type="user" />Home</Link>
    </Menu.Item>
    <SubMenu key="moveFrames" title={<span><Icon type="right" /><span>Frames</span></span>}>
      <Menu.Item key="newMoveFrame">
        <Link to="/moveFrames/new"><Icon type="plus-circle-o" />New Frame</Link>
      </Menu.Item>
      <Menu.Item key="listMoveFrames">
        <Link to="/moveFrames"><Icon type="bars" />List Frames</Link>
      </Menu.Item>
    </SubMenu>
    <SubMenu key="moves" title={<span><Icon type="double-right" /><span>Moves</span></span>}>
      <Menu.Item key="newMove">
        <Link to="/moves/new"><Icon type="plus-circle-o" />New Move</Link>
      </Menu.Item>
      <Menu.Item key="listMoves">
        <Link to="/moves"><Icon type="bars" />List Moves</Link>
      </Menu.Item>
      <Menu.Item key="filter">
        <Link to="/moves/filter"><Icon type="search" />Filter</Link>
      </Menu.Item>
    </SubMenu>
  </Menu>
);

const NavMenu = () => (
  <Header className="vertical-align" style={{height: '46px', position: 'fixed', width: '100%', paddingLeft: '20px', zIndex: '1' }}>
    <Dropdown overlay={menuItems} trigger={['click']}>
      <span className="menu-title"><Icon type="share-alt" style={{marginRight: '7px'}} />BreakiNotes</span>
    </Dropdown>
  </Header>
);

export default NavMenu;
