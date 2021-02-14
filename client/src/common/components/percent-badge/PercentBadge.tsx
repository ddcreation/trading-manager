import React from 'react';
import { ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faPercent } from '@fortawesome/free-solid-svg-icons';

interface PercentBadgeProperties {
  totalTrades: number;
  percent: number;
}

class PercentBadge extends React.Component<PercentBadgeProperties, unknown> {
  render() {
    let percentVariant = 'warning';
    if (this.props.percent > 5) {
      percentVariant = 'success';
    } else if (this.props.percent < 1) {
      percentVariant = 'danger';
    }

    let transactionVariant = 'warning';
    if (this.props.totalTrades > 5) {
      transactionVariant = 'success';
    } else if (this.props.totalTrades < 2) {
      transactionVariant = 'danger';
    }

    const badgeClasses = 'py-1 px-3';
    return (
      <Row>
        <ListGroup horizontal>
          <ListGroup.Item className={badgeClasses}>
            <FontAwesomeIcon icon={faDollarSign} />
          </ListGroup.Item>
          <ListGroup.Item variant={transactionVariant} className={badgeClasses}>
            {this.props.totalTrades}
          </ListGroup.Item>
        </ListGroup>
        <ListGroup horizontal className='mx-3'>
          <ListGroup.Item className={badgeClasses}>
            <FontAwesomeIcon icon={faPercent} />
          </ListGroup.Item>
          <ListGroup.Item variant={percentVariant} className={badgeClasses}>
            {this.props.percent > 0 ? '+' : ''} {this.props.percent.toFixed(2)}
          </ListGroup.Item>
        </ListGroup>
      </Row>
    );
  }
}

export default PercentBadge;
