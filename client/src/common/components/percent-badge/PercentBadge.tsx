import React from 'react';
import { Badge } from 'react-bootstrap';

interface PercentBadgeProperties {
  percent: number;
}

class PercentBadge extends React.Component<PercentBadgeProperties, unknown> {
  render() {
    let variant = 'warning';
    if (this.props.percent > 5) {
      variant = 'success';
    } else if (this.props.percent < 1) {
      variant = 'danger';
    }
    return (
      <Badge variant={variant}>
        {this.props.percent > 0 ? '+' : ''} {this.props.percent.toFixed(2)} %
      </Badge>
    );
  }
}

export default PercentBadge;
