import React from 'react';
import { Accordion, Button, Card, Col, Form } from 'react-bootstrap';
import { TmLoader } from '../../common/components';
import Select from 'react-select';
import {
  ConnectorConfig,
  ConnectorUserConfig,
} from '../../common/models/Connector';
import { connectorsService } from '../../services/connectors.service';

interface ConnectorsRouteStateConnector {
  config: ConnectorConfig;
  userConfig: ConnectorUserConfig;
  favorites: string[];
  favoritesFilter: string;
}

interface ConnectorsRouteState {
  connectors: {
    [connectorId: string]: ConnectorsRouteStateConnector;
  };
}

class ConnectorsRoute extends React.Component<unknown, ConnectorsRouteState> {
  private _addConnectorRef: React.RefObject<HTMLSelectElement>;

  constructor(props: unknown) {
    super(props);

    this._addConnectorRef = React.createRef();

    this.state = { connectors: {} };
  }

  addConnector = (selectedOption: { value: string }) => {
    if (!selectedOption.value) {
      return;
    }

    const connector = this.state.connectors[selectedOption.value]
      .config as ConnectorConfig;

    const emptyConfig: ConnectorUserConfig = {
      enabled: false,
      favoritesAssets: [],
    };
    Object.keys(connector.properties).forEach(
      (prop) => (emptyConfig[prop] = null)
    );

    this._updateStateConnectorProp(connector.id, 'userConfig', emptyConfig);
  };

  async componentDidMount() {
    const connectors = await connectorsService.listConnectors$();

    const getConfigs = connectors.map((connector) => {
      this._updateStateConnectorProp(
        connector.id as string,
        'config',
        connector
      );
      return connectorsService.getConfig$(connector.id);
    });

    Promise.all(getConfigs).then((userConfigsArray) => {
      userConfigsArray.forEach((uconf) => {
        this._updateStateConnectorProp(
          uconf.connector_id as string,
          'userConfig',
          uconf
        );
      });
    });
  }

  connectorAccordionSelect = (event: any, connectorId: string) => {
    if (
      event === 'favorites' &&
      !this.state.connectors[connectorId].favorites
    ) {
      connectorsService.listConnectorAssets$(connectorId).then((assets) => {
        this._updateStateConnectorProp(connectorId, 'favorites', assets);
      });
    }
  };

  connectorHasUserConfig = (connectorId: string): boolean => {
    return (
      this.state.connectors &&
      this.state.connectors[connectorId] &&
      this.state.connectors[connectorId].userConfig &&
      Object.keys(this.state.connectors[connectorId].userConfig).length !== 0
    );
  };

  submitConnectorConfig = (event: any, connectorId: string) => {
    event.preventDefault();

    const connector = this.state.connectors[connectorId].config;

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
      .then(() =>
        this._updateStateConnectorProp(connectorId, 'favoritesFilter', '')
      );
  };

  render() {
    if (
      !this.state ||
      !this.state.connectors ||
      Object.keys(this.state.connectors).length === 0
    ) {
      return <TmLoader />;
    }

    const connectorsWithConfigs = Object.keys(this.state.connectors)
      .filter(this.connectorHasUserConfig)
      .map((connectorId) => this.state.connectors[connectorId].config);

    const selectConfigOptions = Object.keys(this.state.connectors).map(
      (connectorId) => ({
        label: this.state.connectors[connectorId].config.name,
        value: connectorId,
      })
    );

    return (
      <React.Fragment>
        <Select
          options={selectConfigOptions}
          isOptionDisabled={(option: any) =>
            this.connectorHasUserConfig(option.value)
          }
          onChange={this.addConnector}
          placeholder='Add connector...'
        ></Select>

        {/* <Form onSubmit={this.addConnector}>
          <Row>
            <Col>
              <Form.Group controlId='addConnector'>
                <Form.Control
                  as={Select}
                  ref={this._addConnectorRef}
                  size='lg'
                  custom
                >
                  {Object.keys(this.state.connectors).map((connectorId) => {
                    return (
                      <option
                        value={connectorId}
                        disabled={this.connectorHasUserConfig(connectorId)}
                      >
                        {this.state.connectors[connectorId].config.name}
                      </option>
                    );
                  })}
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
        </Form> */}
        {connectorsWithConfigs.map((connector) => (
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
                          this.state.connectors[connector.id].userConfig.enabled
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
    );
  }

  renderFavorites = (connectorId: string) => {
    const connector = this.state.connectors[connectorId].config;
    const userConfig = this.state.connectors[connectorId].userConfig;
    const connectorAssets = this.state.connectors[connectorId].favorites;
    const filter = this.state.connectors[connectorId].favoritesFilter;

    return connectorAssets ? (
      <React.Fragment>
        <Form.Group controlId='assetsFilter'>
          <Form.Control
            type='text'
            placeholder='Filter...'
            onChange={(e: any) =>
              this._updateStateConnectorProp(
                connectorId,
                'favoritesFilter',
                e.target.value
              )
            }
            value={filter || ''}
          />
        </Form.Group>
        <Form onSubmit={(e) => this.submitConnectorFavorites(e, connector.id)}>
          <Form.Row>
            {connectorAssets.map((assetName) => (
              <Col
                className={
                  filter && !assetName.match(new RegExp(filter, 'i'))
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

  renderConnectorProperty = (connector: ConnectorConfig, property: string) => {
    const connectorProperty = connector.properties[property];
    let field;

    const userConfig = this.state.connectors[connector.id].userConfig;
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

  private _updateStateConnectorProp = (
    connectorId: string,
    prop: string,
    propValue: any
  ) => {
    this.setState({
      connectors: {
        [connectorId]: {
          ...this.state.connectors[connectorId],
          [prop]: propValue,
        },
      },
    });
  };
}

export default ConnectorsRoute;
