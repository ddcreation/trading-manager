import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { AppNavigation, Page } from './common/components';
import AppRoutes from './routes/AppRoutes';
import LoginRoute from './routes/login/Login';

interface AppProps {
  authenticated: boolean;
}

class App extends Component<AppProps, unknown> {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <AppNavigation />
          <Switch>
            {this.props?.authenticated ? (
              <React.Fragment>
                {AppRoutes.map((route, idx) => (
                  <Route key={idx} exact path={route.path}>
                    <Page title={route.title} component={route.component} />
                  </Route>
                ))}
                <Route path='/'>
                  <Redirect to='/dashboard'></Redirect>
                </Route>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Route exact path='/login'>
                  <LoginRoute></LoginRoute>
                </Route>
                <Route path='/'>
                  <Redirect to='/login'></Redirect>
                </Route>
              </React.Fragment>
            )}
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => ({
  authenticated: !!state.user.authenticated,
});

export default connect(mapStateToProps)(App);
