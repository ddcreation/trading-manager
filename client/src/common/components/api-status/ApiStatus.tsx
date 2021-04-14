import React from 'react';
import { Badge, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import api from '../../../utils/api';

interface AppState {
  apiResponse: string;
}

class ApiStatus extends React.Component<unknown, AppState> {
  constructor(props: unknown) {
    super(props);
    this.state = { apiResponse: '' };
  }

  componentDidMount() {
    api
      .retrieve<string>(api.resources.healthcheck)
      .then((res) => this.setState({ apiResponse: res }));
  }

  popover = (props: any) => {
    return (
      <Popover id='apiStatusPopover' {...props}>
        <Popover.Title as='h3'>API Status</Popover.Title>
        <Popover.Content>{this.state.apiResponse}</Popover.Content>
      </Popover>
    );
  };

  render() {
    return (
      <OverlayTrigger trigger='click' placement='bottom' overlay={this.popover}>
        <Button variant='link'>
          <Badge pill variant={!this.state.apiResponse ? 'danger' : 'success'}>
            Api
          </Badge>
        </Button>
      </OverlayTrigger>
    );
  }
}

export default ApiStatus;
