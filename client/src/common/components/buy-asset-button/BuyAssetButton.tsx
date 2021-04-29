import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { OrderDirection } from '../../models/Order';
import OrderForm from '../order-form/OrderForm';

interface BuyAssetButtonProps {
  connectorId: string;
  symbol: string;
}

interface BuyAssetButtonState {
  modalShow: boolean;
}

class BuyAssetButton extends React.Component<
  BuyAssetButtonProps,
  BuyAssetButtonState
> {
  state = { modalShow: false };

  render() {
    return (
      <React.Fragment>
        <Button size='sm' onClick={() => this.setState({ modalShow: true })}>
          Buy
        </Button>

        <Modal
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Order {this.props.symbol}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <OrderForm
              symbol={this.props.symbol}
              direction={OrderDirection.BUY}
              connectorId={this.props.connectorId}
              onSubmit={() => this.setState({ modalShow: false })}
            ></OrderForm>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

export default BuyAssetButton;
