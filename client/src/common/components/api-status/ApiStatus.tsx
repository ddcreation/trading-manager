import React from 'react';
import { Badge } from 'react-bootstrap';

interface AppProperties {}

interface AppState {
  apiResponse: string;
}

class ApiStatus extends React.Component<AppProperties, AppState> {
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
    if (!this.state.apiResponse) {
      return <Badge variant='danger'>API Error</Badge>;
    }
    return <Badge variant='success'>{this.state.apiResponse}</Badge>;
  }
}

export default ApiStatus;
