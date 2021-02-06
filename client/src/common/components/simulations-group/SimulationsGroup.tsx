import React from 'react';
import { Alert } from 'react-bootstrap';
import api from '../../../utils/api';
import TmLoader from '../tm-loader/TmLoader';

interface SimulationsGroupProps {
  symbol: string;
}

interface SimulationsGroupState {
  loading: boolean;
  simulations: unknown[];
}

class SimulationsGroup extends React.Component<
  SimulationsGroupProps,
  SimulationsGroupState
> {
  state = { loading: true, simulations: [] };

  componentDidMount() {
    this.loadSimulations();
  }

  componentDidUpdate(prevProps: SimulationsGroupProps) {
    if (prevProps.symbol !== this.props.symbol) {
      this.loadSimulations();
    }
  }

  loadSimulations() {
    this.setState({ loading: true, simulations: [] });
    api
      .retrieve<unknown[]>(
        `${api.resources.cryptos}/${this.props.symbol}/simulations`
      )
      .then(
        (response) => {
          this.setState({ loading: false, simulations: response });
        },
        (error) => {
          this.setState({ loading: false, simulations: [] });
        }
      );
  }

  render() {
    return (
      <div>
        {!this.state.loading &&
        this.state.simulations &&
        this.state.simulations.length ? (
          <div>SimulationsGroup X</div>
        ) : (
          <Alert variant='danger'>ERROR: Unable to retrieve simulations.</Alert>
        )}
        {this.state.loading && <TmLoader />}
      </div>
    );
  }
}

export default SimulationsGroup;
