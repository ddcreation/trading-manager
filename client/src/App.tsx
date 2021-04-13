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
          {this.props?.authenticated ? (
            <Switch>
              {AppRoutes.map((route, idx) => (
                <Route key={idx} path={route.path}>
                  <Page title={route.title} component={route.component} />
                </Route>
              ))}
            </Switch>
          ) : (
            <Switch>
              <Route exact path='/login'>
                <LoginRoute></LoginRoute>
              </Route>
              <Route path='/'>
                <Redirect to='/login'></Redirect>
              </Route>
            </Switch>
          )}
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => ({
  authenticated: !!state.user.authenticated,
});

export default connect(mapStateToProps)(App);
