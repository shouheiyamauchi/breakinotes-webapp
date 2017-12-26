import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';

const menuItems = (
  <Menu>
    <Menu.Item key="0">
      <Link to="/"><Icon type="user" />Home</Link>
    </Menu.Item>
    <Menu.Item key="1">
      <Link to="/newmove"><Icon type="question-circle-o" />New Move</Link>
    </Menu.Item>
  </Menu>
);

const NavMenu = () => (
  <Dropdown overlay={menuItems} trigger={['click']}>
    <span className="menu-title"><Icon type="ant-design" style={{marginRight: '10px'}} />BreakiNotes</span>
  </Dropdown>
);

export default NavMenu;
