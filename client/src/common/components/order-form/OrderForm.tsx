import { Component } from 'react';
import {
  FormFieldConfig,
  FormFieldType,
  FormFieldValidatorType,
} from '../../models/DynamicForm';
import { OrderDirection, OrderDirectionType } from '../../models/Order';
import DynamicFormComponent from '../dynamic-form/DynamicForm';

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
    const form: FormFieldConfig[] = [
      {
        label: 'Amount',
        name: 'price',
        type: FormFieldType.numeric,
        validators: [
          { type: FormFieldValidatorType.required },
          { type: FormFieldValidatorType.min, value: 10 },
        ],
      },
      {
        label: 'Asset',
        name: 'symbol',
        type: FormFieldType.hidden,
        options: { disabled: true },
        value: this.props.symbol,
      },
      {
        label: 'Direction',
        name: 'direction',
        type: FormFieldType.text,
        options: { disabled: true },
        value: OrderDirection.BUY,
      },
      {
        label: 'Stop loss',
        name: 'stopLoss',
        type: FormFieldType.numeric,
      },
      {
        label: 'Take profit',
        name: 'takeProfit',
        type: FormFieldType.numeric,
      },
    ];
    return (
      <DynamicFormComponent
        fields={form}
        onSubmit={this.submitForm}
        submitLabel='Confirm order'
      ></DynamicFormComponent>
    );
  }

  public submitForm = (form: any) => {
    // TODO Call place order endpoint
    console.log('Call place order endpoint', form);
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  };
}

export default OrderForm;
