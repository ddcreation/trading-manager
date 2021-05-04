import { Component } from 'react';
import { connectorsService } from '../../../services/connectors.service';
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
        name: 'amount',
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
        label: 'Source',
        name: 'source',
        type: FormFieldType.hidden,
        options: { disabled: true },
        value: 'MANUAL',
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

  public submitForm = async (form: any) => {
    await connectorsService.placeOrder$(this.props.connectorId, form);

    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  };
}

export default OrderForm;
