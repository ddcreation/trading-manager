import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import AppNavigation from './common/components/app-navigation/AppNavigation';
import AppRoutes from './routes/AppRoutes';
import Page from './common/components/page/Page';

function App() {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

export default App;
