import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import api from '../../../utils/api';
import { Tick } from '../../models';

interface CryptoCardProps {
  symbol: string;
}

interface CryptoCardState {
  history: Tick[];
  loading: boolean;
}

const graphOptions = {
  elements: {
    line: {
      borderColor: 'red',
      tension: 0,
    },
  },
};

class CryptoCard extends React.Component<CryptoCardProps, CryptoCardState> {
  state = { loading: true, history: [] };

  componentDidMount() {
    this.updateGraph();
  }

  componentDidUpdate(prevProps: CryptoCardProps) {
    if (prevProps.symbol !== this.props.symbol) {
      this.updateGraph();
    }
  }

  graphDatas() {
    return {
      labels: this.state.history.map((tick: Tick) => {
        const time = new Date(tick.closeTime).toLocaleTimeString();
        return time.substr(0, time.length - 3);
      }),
      datasets: [
        {
          label: 'Close price',
          fill: false,
          data: this.state.history.map((tick: Tick) => tick.close),
        },
      ],
    };
  }

  render() {
    return (
      <Card>
        <Card.Header>
          <h3>{this.props.symbol}</h3>
        </Card.Header>
        <Card.Body>
          {this.state.loading ? (
            <div className='text-center mt-3'>
              <Spinner animation='border' role='status'>
                <span className='sr-only'>Loading...</span>
              </Spinner>
            </div>
          ) : (
            this.state.history.length && (
              <Line data={this.graphDatas()} options={graphOptions} />
            )
          )}
        </Card.Body>
      </Card>
    );
  }

  updateGraph() {
    this.setState({ loading: true, history: [] });
    api
      .retrieve<Tick[]>(`${api.resources.cryptos}/${this.props.symbol}/history`)
      .then((response) => {
        this.setState({ loading: false, history: response });
      });
  }
}

export default CryptoCard;
