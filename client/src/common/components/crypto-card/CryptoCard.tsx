import React from 'react';
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { connectorsService } from '../../../services/connectors.service';
import { Tick } from '../../models';
import OrderForm from '../order-form/OrderForm';
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
                    <Button onClick={() => this.setState({ modalShow: true })}>
                      Buy
                    </Button>
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
        <Modal
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Order {this.props.asset}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <OrderForm
              symbol={this.props.asset}
              connectorId={this.props.connectorId}
              onSubmit={() => this.setState({ modalShow: false })}
            ></OrderForm>
          </Modal.Body>
        </Modal>
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

  updateModalVisibility(bool: boolean): void {
    if (bool !== this.state.modalShow) {
      this.setState({ modalShow: bool });
    }
  }
}

export default CryptoCard;
