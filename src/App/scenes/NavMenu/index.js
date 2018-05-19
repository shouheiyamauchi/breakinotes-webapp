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
      <Menu.Item key="newMoveSet">
        <Link to="/moveSets/new"><Icon type="folder-open" />New Set</Link>
      </Menu.Item>
    </SubMenu>
    <Menu.Item key="practiceItems">
      <Link to="/practiceItems"><Icon type="bars" />Training Menu</Link>
    </Menu.Item>
    <Menu.Item key="listMoveFrames">
      <Link to="/moveFrames"><Icon type="file" />Frames List</Link>
    </Menu.Item>
    <Menu.Item key="filter">
      <Link to="/moves/filter"><Icon type="file-text" />Moves List</Link>
    </Menu.Item>
    <Menu.Item key="listMoveSets">
      <Link to="/moveSets"><Icon type="folder-open" />Sets List</Link>
    </Menu.Item>
  </Menu>
);

const NavMenu = () => (
  <Header className="vertical-align" style={{height: '46px', position: 'fixed', top: '0', width: '100%', paddingLeft: '20px', zIndex: '1' }}>
    <Dropdown overlay={menuItems} trigger={['click']}>
      <span className="menu-title"><Icon type="api" style={{marginRight: '7px'}} />BreakiNotes</span>
    </Dropdown>
  </Header>
);

export default NavMenu;
