import { API_URL } from 'helpers/config';
import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import { Form, Icon, Input, Button, Card } from 'antd';

const FormItem = Form.Item;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    }
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = e => {
    e.preventDefault();

    axios.post(API_URL + 'users/login', qs.stringify({
      username: this.state.username,
      password: this.state.password
    }))
      .then((response) => {
        localStorage.setItem('breakinotes', response.data.token);
        this.props.updateLoggedInStatus();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div style={{ background: '#ECECEC', padding: '30px', minHeight: '100vh' }}>
        <Card title="Login to Breakinotes" style={{ width: '100%' }}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              <Input
                value={this.state.username}
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="username"
                placeholder="Username"
                onChange={this.handleInputChange}
              />
            </FormItem>
            <FormItem>
              <Input
                value={this.state.password}
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="password"
                type="password"
                placeholder="Password"
                onChange={this.handleInputChange}
              />
            </FormItem>
            <FormItem>
            <Button type="primary" htmlType="submit">
              Log in
            </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

export default Login;
