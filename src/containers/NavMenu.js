import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';

const menuItems = (
  <Menu>
    <Menu.Item key="0">
      <Link to="/"><Icon type="user" />Home</Link>
    </Menu.Item>
    <Menu.Item key="1">
      <Link to="/moves/new"><Icon type="plus-circle-o" />New Move</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to="/moves/filter"><Icon type="search" />Filter</Link>
    </Menu.Item>
  </Menu>
);

const NavMenu = () => (
  <Dropdown overlay={menuItems} trigger={['click']}>
    <span className="menu-title"><Icon type="share-alt" style={{marginRight: '7px'}} />BreakiNotesss</span>
  </Dropdown>
);

export default NavMenu;
