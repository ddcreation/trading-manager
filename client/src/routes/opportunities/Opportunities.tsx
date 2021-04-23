import React from 'react';
import { ListGroup } from 'react-bootstrap';
import {
  CryptoCard,
  SimulationPreview,
  TmLoader,
} from '../../common/components';
import MissingConfigAlert from '../../common/components/missing-config/MissingConfigAlert';
import { connectorsService } from '../../services/connectors.service';

interface OpportunitiesState {
  assets: { [symbol: string]: string };
  currentAsset?: string;
  loading: boolean;
}

class OpportunitiesRoute extends React.Component<null, OpportunitiesState> {
  constructor(props: null) {
    super(props);

    this.state = { assets: {}, loading: true };
  }

  async componentDidMount() {
    const connectorsWithConfig = await connectorsService.listActiveConnectors$();

    const assets: { [symbol: string]: string } = {};

    await Promise.all(
      connectorsWithConfig.map((connectorWithConfig) =>
        connectorsService
          .getFavorites$(connectorWithConfig.id)
          .then((favoriteAssets) => {
            favoriteAssets.forEach((symbol) => {
              assets[symbol] = connectorWithConfig.id;
            });
          })
      )
    );

    this.setState({ loading: false, assets });
  }

  renderSimulations() {
    return (
      this.state.currentAsset && (
        <div>
          <CryptoCard
            connectorId={this.state.assets[this.state.currentAsset]}
            asset={this.state.currentAsset}
          />
          <h2 className='mt-5'>Simulations</h2>
          <hr />
          <SimulationPreview
            connectorId={this.state.assets[this.state.currentAsset]}
            asset={this.state.currentAsset}
          ></SimulationPreview>
        </div>
      )
    );
  }

  renderSymbolChooser() {
    return (
      <ListGroup
        className='mb-5'
        horizontal
        onSelect={(evtKey) => this.assetSelection(evtKey as string)}
      >
        {Object.keys(this.state.assets).map((symbol) => (
          <ListGroup.Item
            action
            eventKey={symbol}
            key={`tab-${symbol.toLowerCase()}`}
          >
            {symbol}
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }

  render() {
    return !this.state?.loading ? (
      Object.keys(this.state?.assets).length === 0 ? (
        <MissingConfigAlert config='connector' />
      ) : (
        <React.Fragment>
          {this.renderSymbolChooser()}
          {this.renderSimulations()}
        </React.Fragment>
      )
    ) : (
      <TmLoader />
    );
  }

  assetSelection(symbol: string): void {
    this.setState({ currentAsset: symbol });
  }
}

export default OpportunitiesRoute;
