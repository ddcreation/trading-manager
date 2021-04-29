import { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { OrderDirectionType } from '../../models/Order';

interface OrderFormProps {
  connectorId: string;
  direction: OrderDirectionType;
  symbol: string;
  onSubmit?: () => unknown;
}

interface OrderFormState {
  form: {
    [k: string]: string;
  };
  errors: {
    [k: string]: string;
  };
}

class OrderForm extends Component<OrderFormProps, OrderFormState> {
  constructor(props: OrderFormProps) {
    super(props);

    this.state = {
      form: {},
      errors: {},
    };
  }

  updateField(name: string, value: string) {
    this.setState({
      form: { ...this.state.form, [name]: value },
    });
  }

  render() {
    return (
      <Form noValidate onSubmit={this.submitForm}>
        <Form.Group controlId='price'>
          <Form.Control
            type='text'
            placeholder='price'
            onChange={(e) => this.updateField('price', e.target.value)}
            isInvalid={!!this.state.errors.price}
          />
          <Form.Control.Feedback type='invalid'>
            {this.state.errors.price}
          </Form.Control.Feedback>
        </Form.Group>

        <Button className='w-100' type='submit'>
          Confirm order
        </Button>
      </Form>
    );
  }

  public submitForm = (event: any) => {
    event.preventDefault();

    const errors: { [k: string]: string } = {};
    ['price'].forEach((field) => {
      if (!this.state.form[field] || this.state.form[field].length === 0) {
        errors[field] = 'Required';
      }
    });

    this.setState(
      {
        errors,
      },
      () => {
        if (
          Object.keys(this.state.errors).filter(
            (key: string) => this.state.errors[key]
          ).length === 0
        ) {
          // TODO Call place order endpoint
          console.log('Call place order endpoint');
          if (this.props.onSubmit) {
            this.props.onSubmit();
          }
        }
      }
    );
  };
}

export default OrderForm;
