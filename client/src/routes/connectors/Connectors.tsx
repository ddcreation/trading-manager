import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { TmLoader } from '../../common/components';
import {
  ConnectorConfig,
  ConnectorUserConfig,
} from '../../common/models/Connector';
import { connectorsService } from '../../services/connectors.service';

interface ConnectorsRouteState {
  connectors: ConnectorConfig[];
  connectorsUserConfigs: { [connectorId: string]: ConnectorUserConfig };
  favorites: {
    [connectorId: string]: string[];
  };
  filters: {
    [connectorId: string]: string;
  };
}

class ConnectorsRoute extends React.Component<unknown, ConnectorsRouteState> {
  private _addConnectorRef: React.RefObject<HTMLSelectElement>;

  constructor(props: unknown) {
    super(props);

    this._addConnectorRef = React.createRef();
  }

  addConnector = (event: React.FormEvent) => {
    event.preventDefault();

    const connector = this.state.connectors.find(
      (connector) => connector.id === this._addConnectorRef.current?.value
    ) as ConnectorConfig;

    const emptyConfig: ConnectorUserConfig = {
      enabled: false,
      favoritesAssets: [],
    };
    Object.keys(connector.properties).forEach(
      (prop) => (emptyConfig[prop] = null)
    );

    this.setState({ connectorsUserConfigs: { [connector.id]: emptyConfig } });
  };

  async componentDidMount() {
    const connectors = await connectorsService.listConnectors$();

    const getConfigs = connectors.map((connector) =>
      connectorsService.getConfig$(connector.id)
    );

    Promise.all(getConfigs).then((connectorsUserConfigsArray) => {
      const connectorsUserConfigs = connectorsUserConfigsArray.reduce(
        (confs, current) => ({
          ...confs,
          [current.connector_id as string]: current,
        }),
        {}
      );
      this.setState({ connectors, connectorsUserConfigs: {} });
    });
  }

  connectorAccordionSelect = (event: any, connectorId: string) => {
    if (
      event === 'favorites' &&
      (!this.state.favorites || !this.state.favorites[connectorId])
    ) {
      connectorsService.listConnectorAssets$(connectorId).then((assets) => {
        this.setState({
          favorites: { [connectorId]: assets },
        });
      });
    }
  };

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

  submitConnectorFavorites = (event: any, connectorId: string) => {
    event.preventDefault();

    const favoritesAssets = [...event.target.elements].reduce(
      (selectedAssets, current) => {
        if (current.checked) {
          selectedAssets.push(current.name);
        }
        return selectedAssets;
      },
      []
    );

    connectorsService
      .saveConfig$(connectorId, { favoritesAssets })
      .then(() => this.setState({ filters: { [connectorId]: '' } }));
  };

  renderFavorites = (connectorId: string) => {
    const connector = this.state.connectors.find(
      (connector) => connector.id === connectorId
    ) as ConnectorConfig;

    const userConfig = this.state.connectorsUserConfigs[connectorId];

    return this.state.favorites && this.state.favorites[connector.id] ? (
      <React.Fragment>
        <Form.Group controlId='assetsFilter'>
          <Form.Control
            type='text'
            placeholder='Filter...'
            onChange={(e: any) =>
              this.setState({ filters: { [connectorId]: e.target.value } })
            }
            value={
              this.state.filters && this.state.filters[connectorId]
                ? this.state.filters[connectorId]
                : ''
            }
          />
        </Form.Group>
        <Form onSubmit={(e) => this.submitConnectorFavorites(e, connector.id)}>
          <Form.Row>
            {this.state.favorites[connector.id].map((assetName) => (
              <Col
                className={
                  this.state.filters &&
                  this.state.filters[connectorId] &&
                  !assetName.match(
                    new RegExp(this.state.filters[connectorId], 'i')
                  )
                    ? 'd-none'
                    : 'col-xs-6 col-sm-4 col-md-2'
                }
                key={`${assetName}-asset-${assetName}`}
              >
                <Form.Group
                  controlId={`formFavorites${connector.id}.${assetName}`}
                >
                  <Form.Check
                    inline
                    name={assetName}
                    label={assetName}
                    defaultChecked={
                      userConfig.favoritesAssets &&
                      userConfig.favoritesAssets.includes(assetName)
                    }
                    type='checkbox'
                    className='mb-2'
                  />
                </Form.Group>
              </Col>
            ))}
          </Form.Row>
          <Button variant='primary' type='submit'>
            Save
          </Button>
        </Form>
      </React.Fragment>
    ) : (
      <TmLoader />
    );
  };

  render() {
    return this.state ? (
      <React.Fragment>
        <Form onSubmit={this.addConnector}>
          <Row>
            <Col>
              <Form.Group controlId='addConnector'>
                <Form.Control
                  as='select'
                  ref={this._addConnectorRef}
                  size='lg'
                  custom
                >
                  {this.state.connectors.map((connector) => {
                    return (
                      <option value={connector.id}>{connector.name}</option>
                    );
                  })}
                  <option value='2'>2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col xs='auto'>
              <Button size='lg' type='submit'>
                <FontAwesomeIcon icon={faPlusCircle} className='mr-2' />
                Add connector
              </Button>
            </Col>
          </Row>
        </Form>
        {this.state.connectors
          .filter((connector) =>
            Object.keys(this.state.connectorsUserConfigs).includes(connector.id)
          )
          .map((connector) => (
            <Accordion
              key={connector.id}
              defaultActiveKey='config'
              onSelect={(e) => this.connectorAccordionSelect(e, connector.id)}
            >
              <Card className='my-5'>
                <Card.Header>
                  <Card.Title>
                    <h2>{connector.name}</h2>
                  </Card.Title>
                </Card.Header>
                <Accordion.Toggle as={Card.Header} eventKey='config'>
                  Connector parameters
                </Accordion.Toggle>
                <Accordion.Collapse eventKey='config'>
                  <Card.Body>
                    <Form
                      onSubmit={(e) =>
                        this.submitConnectorConfig(e, connector.id)
                      }
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
                          defaultChecked={
                            (this.state.connectorsUserConfigs[
                              connector.id
                            ] as any).enabled
                          }
                        />
                      </Form.Group>
                      <Button variant='primary' type='submit'>
                        Save
                      </Button>
                    </Form>
                  </Card.Body>
                </Accordion.Collapse>
                <Accordion.Toggle as={Card.Header} eventKey='favorites'>
                  Favorites assets
                </Accordion.Toggle>
                <Accordion.Collapse eventKey='favorites'>
                  <Card.Body>{this.renderFavorites(connector.id)}</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          ))}
      </React.Fragment>
    ) : (
      <TmLoader />
    );
  }

  renderConnectorProperty = (connector: ConnectorConfig, property: string) => {
    const connectorProperty = connector.properties[property];
    let field;

    const userConfig = this.state.connectorsUserConfigs[
      connector.id
    ] as ConnectorUserConfig;
    if (connectorProperty.type === 'boolean') {
      field = (
        <Form.Check
          type='checkbox'
          name={property}
          label={connectorProperty.label}
          defaultChecked={(userConfig as any)[property]}
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
            defaultValue={(userConfig as any)[property]}
            required
          />
        </React.Fragment>
      );
    }
    return field;
  };
}

export default ConnectorsRoute;
