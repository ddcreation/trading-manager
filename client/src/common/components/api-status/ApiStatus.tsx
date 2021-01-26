import React from 'react';
import { Badge } from 'react-bootstrap';
import api from '../../../utils/api';

interface AppProperties {}

interface AppState {
  apiResponse: string;
}

class ApiStatus extends React.Component<AppProperties, AppState> {
  constructor(props: AppProperties) {
    super(props);
    this.state = { apiResponse: '' };
  }

  componentDidMount() {
    api
      .retrieve<string>(api.resources.healthcheck)
      .then((res) => this.setState({ apiResponse: res }));
  }

  render() {
    if (!this.state.apiResponse) {
      return <Badge variant='danger'>API Error</Badge>;
    }
    return <Badge variant='success'>{this.state.apiResponse}</Badge>;
  }
}

export default ApiStatus;
