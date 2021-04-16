import { faGlobeEurope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { serverService } from '../../../services/server.service';

interface AppState {
  apiResponse: string;
}

class ApiStatus extends React.Component<unknown, AppState> {
  constructor(props: unknown) {
    super(props);
    this.state = { apiResponse: '' };
  }

  componentDidMount() {
    serverService
      .healthcheck$()
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
        <Button variant='light'>
          <FontAwesomeIcon
            icon={faGlobeEurope}
            color={!this.state.apiResponse ? 'red' : 'green'}
          />
        </Button>
      </OverlayTrigger>
    );
  }
}

export default ApiStatus;
