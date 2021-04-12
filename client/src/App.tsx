import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.scss';
import { AppNavigation, Page } from './common/components';
import { User } from './common/models';
import AppRoutes from './routes/AppRoutes';
import LoginRoute from './routes/login/Login';

interface AppState {
  user: User;
}

class App extends Component<unknown, AppState> {
  render() {
    return (
      <React.Fragment>
        {this.state?.user ? (
          <BrowserRouter>
            <AppNavigation />
            <Switch>
              {AppRoutes.map((route, idx) => (
                <Route key={idx} path={route.path}>
                  <Page title={route.title} component={route.component} />
                </Route>
              ))}
            </Switch>
          </BrowserRouter>
        ) : (
          <BrowserRouter>
            <Switch>
              <Route exact path='/login'>
                <LoginRoute></LoginRoute>
              </Route>
              <Route path='/'>
                <Redirect to='/login'></Redirect>
              </Route>
            </Switch>
          </BrowserRouter>
        )}
      </React.Fragment>
    );
  }
}

export default App;
