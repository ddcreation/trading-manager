import React from 'react';
import { Card } from 'react-bootstrap';
import { AssetPrice } from '../../models/Asset';

interface TradingCardProps {
  assetPrice: AssetPrice;
}

interface TradingCardState {}

class TradingCard extends React.Component<TradingCardProps, TradingCardState> {
  render() {
    return (
      <Card>
        {this.props.assetPrice.name} = {this.props.assetPrice.price}
      </Card>
    );
  }
}

export default TradingCard;
