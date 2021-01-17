import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

interface AppProperties {}

interface AppState {
  apiResponse: string;
}

class App extends Component<AppProperties, AppState> {
  constructor(props: AppProperties) {
    super(props);
    this.state = { apiResponse: '' };
  }

  callAPI() {
    fetch('http://localhost:9000/api/healthcheck')
      .then((res) => res.text())
      .then((res) => this.setState({ apiResponse: res }));
  }

  componentWillMount() {
    this.callAPI();
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
          <p>API status: {this.state.apiResponse || 'ERROR'}</p>
        </header>
      </div>
    );
  }
}

export default App;
