import React from 'react';
import { Accordion, Button, Card, Form } from 'react-bootstrap';
import { TmLoader } from '../../common/components';
import { ConnectorConfig } from '../../common/models/Connector';
import { connectorsService } from '../../services/connectors.service';

interface ConnectorsRouteState {
  connectors: ConnectorConfig[];
}

class ConnectorsRoute extends React.Component<unknown, ConnectorsRouteState> {
  async componentDidMount() {
    const connectors = await connectorsService.listConnectors$();

    const getConfigs = connectors.map((connector) => {
      return new Promise((resolve, reject) => {
        connectorsService.getConfig$(connector.id).then((config) => {
          connector.config = config as any;
          resolve(connector);
        });
      });
    });

    Promise.all(getConfigs).then(() => this.setState({ connectors }));
  }

  submitConnectorConfig = (event: any, connectorId: string) => {
    event.preventDefault();

    const connector = this.state.connectors.find(
      (con) => con.id === connectorId
    ) as ConnectorConfig;

    const formElements = event.target.elements;
    const form: { [popertyKey: string]: string | boolean } = Object.keys(
      connector.properties
    ).reduce((acc: any, property: string) => {
      const value =
        connector.properties[property].type === 'boolean'
          ? !!formElements[property].checked
          : formElements[property].value;
      return { ...acc, [property]: value };
    }, {});

    form.enabled = formElements.enabled.checked;

    connectorsService.saveConfig$(connectorId, form);
  };

  render() {
    return this.state ? (
      this.state.connectors.map((connector) => (
        <Accordion key={connector.id} defaultActiveKey='0'>
          <Card className='my-5'>
            <Card.Header>
              <Card.Title>
                <h2>{connector.name}</h2>
              </Card.Title>
            </Card.Header>
            <Accordion.Toggle as={Card.Header} eventKey='0'>
              Connector parameters
            </Accordion.Toggle>
            <Accordion.Collapse eventKey='0'>
              <Card.Body>
                <Form
                  onSubmit={(e) => this.submitConnectorConfig(e, connector.id)}
                >
                  {Object.keys(connector.properties).map((property) => (
                    <Form.Group
                      key={`formConnector${connector.id}.${property}`}
                      controlId={`formConnector${connector.id}.${property}`}
                    >
                      {this.renderConnectorProperty(connector, property)}
                    </Form.Group>
                  ))}
                  <Form.Group
                    controlId={`formConnector${connector.id}.enabled`}
                  >
                    <Form.Check
                      type='checkbox'
                      name='enabled'
                      label='Activate connector'
                      defaultChecked={(connector.config as any).enabled}
                    />
                  </Form.Group>
                  <Button variant='primary' type='submit'>
                    Save
                  </Button>
                </Form>
              </Card.Body>
            </Accordion.Collapse>
            {/* <Accordion.Toggle as={Card.Header} eventKey='1'>
              Favorites assets
            </Accordion.Toggle>
            <Accordion.Collapse eventKey='1'>
              <Card.Body>
                TODO: List assets
                <Button variant='primary' type='submit'>
                  Save
                </Button>
              </Card.Body>
            </Accordion.Collapse> */}
          </Card>
        </Accordion>
      ))
    ) : (
      <TmLoader />
    );
  }

  renderConnectorProperty = (connector: ConnectorConfig, property: string) => {
    const connectorProperty = connector.properties[property];
    let field;
    if (connectorProperty.type === 'boolean') {
      field = (
        <Form.Check
          type='checkbox'
          name={property}
          label={connectorProperty.label}
          defaultChecked={(connector.config as any)[property]}
        />
      );
    } else {
      field = (
        <React.Fragment>
          <Form.Label>{connectorProperty.label}</Form.Label>
          <Form.Control
            type={
              connectorProperty.type === 'string'
                ? 'text'
                : connectorProperty.type
            }
            name={property}
            defaultValue={(connector.config as any)[property]}
            required
          />
        </React.Fragment>
      );
    }
    return field;
  };
}

export default ConnectorsRoute;
