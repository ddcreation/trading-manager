import React from 'react';
import { Card } from 'react-bootstrap';

interface CryptoSimulationProps {
  simulation: unknown;
}

class CryptoSimulation extends React.Component<CryptoSimulationProps, unknown> {
  render() {
    return <Card>{JSON.stringify(this.props.simulation)}</Card>;
  }
}

export default CryptoSimulation;
