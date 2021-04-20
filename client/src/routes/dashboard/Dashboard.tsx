import React from 'react';
import { Card, Row, Table } from 'react-bootstrap';
import { CryptoCard, TmLoader } from '../../common/components';
import MissingConnectorAlert from '../../common/components/missing-connector/MissingConnectorAlert';
import { Account, ExchangeInfoResponse } from '../../common/models';
import { ConnectorConfig } from '../../common/models/Connector';
import { connectorsService } from '../../services/connectors.service';

interface DashboardConnector {
  account: Account;
  config: ConnectorConfig;
  favoritesAssets: string[];
  exchangeInfos: ExchangeInfoResponse;
}

interface DashboardState {
  connectors: {
    [connectorId: string]: DashboardConnector;
  };
  loading: boolean;
}

class DashboardRoute extends React.Component<unknown, DashboardState> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      connectors: {},
      loading: true,
    };
  }

  connectorDashboardPromises(
    connectorConfig: ConnectorConfig
  ): Promise<DashboardConnector> {
    return new Promise((resolve, reject) => {
      Promise.all([
        connectorsService.getFavorites$(connectorConfig.id),
        connectorsService.getAccount$(connectorConfig.id),
        connectorsService.getExchangeInfos$(connectorConfig.id),
      ]).then(([favoritesAssets, account, exchangeInfos]) => {
        const dashboardConnector = {
          config: connectorConfig,
          account,
          exchangeInfos,
          favoritesAssets,
        };

        this.setState({
          connectors: {
            [connectorConfig.id]: dashboardConnector,
          },
        });

        resolve(dashboardConnector);
      });
    });
  }

  async componentDidMount() {
    const connectors = await connectorsService.listActiveConnectors$();
    const connectorsPromises = connectors.map((connector) =>
      this.connectorDashboardPromises(connector)
    );

    Promise.all(connectorsPromises).then(() =>
      this.setState({ loading: false })
    );
  }

  renderBalance(connector: DashboardConnector) {
    return connector.account.balances?.length ? (
      <Table striped bordered>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Free</th>
          </tr>
        </thead>
        <tbody>
          {connector.account?.balances.map((balance, idx) => {
            return (
              <tr key={'balance-' + idx}>
                <td>balance asset</td>
                <td>balance free {JSON.stringify(balance)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    ) : (
      <i>You haven't any balance.</i>
    );
  }

  renderConnector(connector: DashboardConnector) {
    return (
      <Card key={`connector-${connector.config.id}`}>
        <Card.Header>
          <h2>{connector.config.name}</h2>
        </Card.Header>
        <Card.Body>
          <h3>Balances</h3>
          <Card className='my-3'>
            <Card.Body>{this.renderBalance(connector)}</Card.Body>
          </Card>
          <hr className='my-3' />
          <h3>Favorites</h3>
          <Row>
            {connector.favoritesAssets.map((asset) => (
              <div key={asset} className='col-12 col-lg-6 mt-3'>
                <CryptoCard connectorId={connector.config.id} asset={asset} />
              </div>
            ))}
          </Row>
        </Card.Body>
      </Card>
    );
  }

  render() {
    return !this.state?.loading ? (
      Object.keys(this.state?.connectors).length === 0 ? (
        <MissingConnectorAlert />
      ) : (
        Object.keys(this.state?.connectors).map((connectorId) =>
          this.renderConnector(this.state?.connectors[connectorId])
        )
      )
    ) : (
      <TmLoader />
    );
  }
}

export default DashboardRoute;
