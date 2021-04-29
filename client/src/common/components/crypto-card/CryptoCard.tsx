import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { connectorsService } from '../../../services/connectors.service';
import { Tick } from '../../models';
import BuyAssetButton from '../buy-asset-button/BuyAssetButton';
import TmLoader from '../tm-loader/TmLoader';

interface CryptoCardProps {
  connectorId: string;
  asset: string;
}

interface CryptoCardState {
  history: Tick[];
  loading: boolean;
  modalShow: boolean;
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
  state = { loading: true, modalShow: false, history: [] };

  componentDidMount() {
    this.updateGraph();
  }

  componentDidUpdate(prevProps: CryptoCardProps) {
    if (prevProps.asset !== this.props.asset) {
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
      <React.Fragment>
        <Card>
          <Card.Header>
            <Container className='px-0'>
              <Row>
                <Col md='auto'>
                  <Card.Title>{this.props.asset}</Card.Title>
                </Col>
                <Col>
                  <div className='float-right'>
                    <BuyAssetButton
                      connectorId={this.props.connectorId}
                      symbol={this.props.asset}
                    ></BuyAssetButton>
                  </div>
                </Col>
              </Row>
            </Container>
          </Card.Header>
          <Card.Body>
            {this.state.loading ? (
              <TmLoader />
            ) : (
              this.state.history.length && (
                <Line data={this.graphDatas()} options={graphOptions} />
              )
            )}
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }

  updateGraph() {
    this.setState({ loading: true, history: [] });
    connectorsService
      .getAssetHistory$(this.props.connectorId, this.props.asset)
      .then((response) => {
        this.setState({ loading: false, history: response });
      });
  }
}

export default CryptoCard;
