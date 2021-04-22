import React from 'react';
import { Card, Row, Table } from 'react-bootstrap';
import { CryptoCard, TmLoader } from '../../common/components';
import MissingConfigAlert from '../../common/components/missing-config/MissingConfigAlert';
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

  renderBalances() {
    const aggregatedBalances = Object.keys(this.state.connectors).reduce(
      (balances, connectorId) => {
        return [
          ...balances,
          ...(this.state.connectors[connectorId].account.balances || []),
        ];
      },
      [] as string[]
    );

    return (
      <React.Fragment>
        <h3>Balances</h3>
        <Card className='my-3'>
          <Card.Body>
            {aggregatedBalances.length ? (
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Free</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregatedBalances.map((balance, idx) => {
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
            )}
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }

  renderFavorites() {
    const aggregatedFavorites = Object.keys(this.state.connectors).reduce(
      (favorites, connectorId) => ({
        ...favorites,
        ...(this.state.connectors[connectorId].favoritesAssets
          ? {
              [connectorId]: this.state.connectors[connectorId].favoritesAssets,
            }
          : {}),
      }),
      {} as { [connectorId: string]: string[] }
    );

    return (
      <React.Fragment>
        <h3>Favorites</h3>
        <Row>
          {Object.keys(aggregatedFavorites).length !== 0 ? (
            Object.keys(aggregatedFavorites).map((connectorId) =>
              aggregatedFavorites[connectorId].map((asset) => (
                <div key={asset} className='col-12 col-lg-6 mt-3'>
                  <CryptoCard connectorId={connectorId} asset={asset} />
                </div>
              ))
            )
          ) : (
            <MissingConfigAlert config='favorites' />
          )}
        </Row>
      </React.Fragment>
    );
  }

  render() {
    return !this.state?.loading ? (
      Object.keys(this.state?.connectors).length === 0 ? (
        <MissingConfigAlert config='connector' />
      ) : (
        <React.Fragment>
          {this.renderBalances()}
          <div className='py-4'></div>
          {this.renderFavorites()}
        </React.Fragment>
      )
    ) : (
      <TmLoader />
    );
  }
}

export default DashboardRoute;
