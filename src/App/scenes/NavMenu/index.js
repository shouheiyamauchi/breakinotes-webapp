import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';

const menuItems = (
  <Menu>
    <Menu.Item key="home">
      <Link to="/"><Icon type="user" />Home</Link>
    </Menu.Item>
    <Menu.Item key="moves">
      <Link to="/moves"><Icon type="user" />Moves</Link>
    </Menu.Item>
    <Menu.Item key="moveFrames">
      <Link to="/moveFrames"><Icon type="user" />Move Frames</Link>
    </Menu.Item>
    <Menu.Item key="newMove">
      <Link to="/moves/new"><Icon type="plus-circle-o" />New Move</Link>
    </Menu.Item>
    <Menu.Item key="newMoveFrame">
      <Link to="/moveFrames/new"><Icon type="plus-circle-o" />New Move Frame</Link>
    </Menu.Item>
    <Menu.Item key="filter">
      <Link to="/moves/filter"><Icon type="search" />Filter</Link>
    </Menu.Item>
  </Menu>
);

const NavMenu = () => (
  <Dropdown overlay={menuItems} trigger={['click']}>
    <span className="menu-title"><Icon type="share-alt" style={{marginRight: '7px'}} />BreakiNotes</span>
  </Dropdown>
);

export default NavMenu;
