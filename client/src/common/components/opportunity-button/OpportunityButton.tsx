import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TransactionDirection } from '../../models';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

interface OpportunityButtonProperties {
  asset: string;
  direction: TransactionDirection;
}

class OpportunityButton extends React.Component<
  OpportunityButtonProperties,
  unknown
> {
  render() {
    return (
      <Button
        size='sm'
        variant={this.props.direction === 'buy' ? 'success' : 'danger'}
      >
        <FontAwesomeIcon
          icon={this.props.direction === 'buy' ? faArrowUp : faArrowDown}
          className='mr-1'
        />
        {this.props.direction === 'buy'
          ? 'Buy opportunity'
          : 'Sell opportunity'}
      </Button>
    );
  }
}

export default OpportunityButton;
