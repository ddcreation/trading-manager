import React from 'react';
import { Card } from 'react-bootstrap';
import { Asset } from '../../models/Asset';

interface TradingCardProps {
  asset: Asset;
}

interface TradingCardState {}

class TradingCard extends React.Component<TradingCardProps, TradingCardState> {
  render() {
    return (
      <Card>
        {this.props.asset.name} = {this.props.asset.price}
      </Card>
    );
  }
}

export default TradingCard;
