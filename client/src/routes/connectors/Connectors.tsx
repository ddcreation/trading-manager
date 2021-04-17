import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { TmLoader } from '../../common/components';
import { connectorsService } from '../../services/connectors.service';

interface ConnectorsRouteState {
  connectors: any[];
}

class ConnectorsRoute extends React.Component<unknown, ConnectorsRouteState> {
  componentDidMount() {
    connectorsService
      .listConnectors$()
      .then((connectors) => this.setState({ connectors }));
  }

  render() {
    return this.state ? (
      <React.Fragment>
        {this.state.connectors.map((connector) => (
          <Card className='my-5'>
            <Card.Header>
              <Card.Title>
                <h2>{connector.name}</h2>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {Object.keys(connector).map((param) => (
                <Row key={`account-${param}`}>
                  <Col>
                    <label>{param}</label>
                  </Col>
                  <Col className='text-aling-right'>
                    {JSON.stringify(connector[param as keyof Account])}
                  </Col>
                </Row>
              ))}
            </Card.Body>
          </Card>
        ))}
      </React.Fragment>
    ) : (
      <TmLoader />
    );
  }
}

export default ConnectorsRoute;
