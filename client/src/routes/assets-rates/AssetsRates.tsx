import React from 'react';
import { TmLoader, TradingCard } from '../../common/components';
import MissingConfigAlert from '../../common/components/missing-config/MissingConfigAlert';
import { AssetPrice } from '../../common/models';
import { connectorsService } from '../../services/connectors.service';

interface AssetsRatesAsset {
  [key: string]: string;
}

interface AssetsRatesState {
  assets: AssetsRatesAsset;
  loading: boolean;
}

class AssetsRatesRoute extends React.Component<unknown, AssetsRatesState> {
  constructor(props: unknown) {
    super(props);

    this.state = { assets: {}, loading: true };
  }

  componentDidMount() {
    this.loadCryptos();
  }

  async loadCryptos() {
    const connectorsWithConfig = await connectorsService.listActiveConnectors$();

    let assets: AssetsRatesAsset = {};
    await Promise.all(
      connectorsWithConfig.map((connectorWithConfig) =>
        connectorsService
          .getPrices$(connectorWithConfig.id)
          .then((connectorAssets) => {
            assets = { ...assets, ...connectorAssets };
          })
      )
    );

    this.setState({ loading: false, assets });
  }

  renderAssets() {
    const assets = Object.keys(this.state.assets || []).map((asset) => ({
      name: asset,
      price: Number(this.state.assets[asset]),
    }));

    return assets.map((asset: AssetPrice, idx: number) => (
      <TradingCard assetPrice={asset} key={asset.name + idx} />
    ));
  }

  render() {
    return !this.state?.loading ? (
      Object.keys(this.state.assets).length === 0 ? (
        <MissingConfigAlert config='connector' />
      ) : (
        this.renderAssets()
      )
    ) : (
      <TmLoader />
    );
  }
}

export default AssetsRatesRoute;
