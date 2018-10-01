import { API_URL } from 'helpers/config';
import React, { Component } from 'react';
import axios from 'axios';
import { Layout, Affix, Button, Icon } from 'antd';
import { MovesContextProvider } from './contexts/MovesContext'
import Login from './scenes/Login';
import NavMenu from './scenes/NavMenu';
import ContentBody from './scenes/ContentBody';
import LoadingMessage from 'App/components/LoadingMessage';
import TransitionContainer from 'App/components/TransitionContainer';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      userToken: null
    };
  }

  componentWillMount() {
    this.updateLoggedInStatus();
  }

  updateLoggedInStatus = () => {
    axios.get(API_URL + 'users/checkAuthentication', {
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('breakinotes')
      }
    })
      .then((response) => {
        this.setState({ loading: false, userToken: localStorage.getItem('breakinotes') });
      })
      .catch((error) => {
        // invalid login token
        this.setState({ loading: false, userToken: null });
      })
  }

  removeAuthToken = () => {
    localStorage.removeItem('breakinotes');
    this.updateLoggedInStatus();
  }

  render() {
    const {
      loading,
      userToken
    } = this.state;

    return (
      <Layout>
        <LoadingMessage loading={loading}>
          <TransitionContainer key={userToken}>
            {!userToken ? (
              <Login updateLoggedInStatus={this.updateLoggedInStatus} />
            ) : (
              <MovesContextProvider>
                <NavMenu removeAuthToken={this.removeAuthToken} />
                <ContentBody removeAuthToken={this.removeAuthToken} path={this.props.location.pathname} />
                <Affix style={{position: 'fixed', bottom: '20px', right: '20px'}}>
                  <Button.Group>
                    <Button type="dashed" onClick={() => window.history.back()}>
                      <Icon type="left" />
                    </Button>
                    <Button type="dashed" onClick={() => window.history.forward()}>
                      <Icon type="right" />
                    </Button>
                  </Button.Group>
                </Affix>
              </MovesContextProvider>
            )}
          </TransitionContainer>
        </LoadingMessage>
      </Layout>
    );
  }
}

export default App;
