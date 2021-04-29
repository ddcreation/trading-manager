import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import {
  DynamicForm,
  FormFieldConfig,
  FormFieldType,
  FormFieldValidator,
  FormFieldValidatorType,
} from '../../models/DynamicForm';

export interface DynamicFormProps {
  fields: FormFieldConfig[];
  submitLabel: string;
  onSubmit?: (formValue: { [key: string]: any }) => void;
}

interface DynamicFormsErrors {
  [k: string]: string;
}

export interface DynamicFormState {
  form: DynamicForm;
  errors: DynamicFormsErrors;
  loading: boolean;
}

class DynamicFormComponent extends Component<
  DynamicFormProps,
  DynamicFormState
> {
  constructor(props: DynamicFormProps) {
    super(props);
    const initForm = this.props.fields.reduce(
      (form, fieldConfig) => ({
        ...form,
        [fieldConfig.name]: fieldConfig.value || null,
      }),
      {} as DynamicForm
    );
    console.log(initForm);
    this.state = {
      form: initForm,
      errors: {},
      loading: false,
    };
  }

  updateField(fieldName: string, value: any) {
    this.setState({
      form: { ...this.state.form, [fieldName]: value },
    });
  }

  render() {
    return (
      <Form noValidate onSubmit={(e) => this.submitForm(e)}>
        {this.props.fields.map((field) => this.renderGroup(field))}
        <Button className='w-100' type='submit'>
          {this.props.submitLabel}
        </Button>
      </Form>
    );
  }

  renderControl(fieldConfig: FormFieldConfig) {
    let fieldView;

    switch (fieldConfig.type) {
      default: {
        fieldView = (
          <React.Fragment>
            <Form.Label>{fieldConfig.label}</Form.Label>
            <Form.Control
              type='text'
              onChange={(e) =>
                this.updateField(fieldConfig.name, e.target.value)
              }
              isInvalid={!!this.state.errors[fieldConfig.name]}
              defaultValue={fieldConfig.value || ''}
              disabled={
                fieldConfig.options &&
                typeof fieldConfig.options.disabled !== 'undefined'
                  ? fieldConfig.options.disabled
                  : false
              }
            />
          </React.Fragment>
        );
        break;
      }

      case FormFieldType.hidden: {
        fieldView = null;
      }
    }

    return fieldView;
  }

  renderGroup(fieldConfig: FormFieldConfig) {
    return (
      <Form.Group controlId={fieldConfig.name}>
        {this.renderControl(fieldConfig)}
        <Form.Control.Feedback type='invalid'>
          {this.state.errors[fieldConfig.name]}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }

  public submitForm(event: any) {
    event.preventDefault();

    const errors = this.validateForm();

    this.setState({ errors }, () => {
      if (!Object.keys(this.state.errors).length && this.props.onSubmit) {
        this.props.onSubmit(this.state.form);
      }
    });
  }

  validateField(field: FormFieldConfig): string | null {
    if (!field.validators) {
      return null;
    }

    let error: string | null = null;
    field.validators.forEach((validator) => {
      error =
        error ||
        this.validateValueForValidator(this.state.form[field.name], validator);
    });

    return error;
  }

  validateValueForValidator(
    value: any,
    validator: FormFieldValidator
  ): string | null {
    let error = null;

    switch (validator.type) {
      case FormFieldValidatorType.required: {
        if (!value || value.length === 0) {
          error = 'Required';
        }
        break;
      }
      case FormFieldValidatorType.max: {
        if (validator.value && +value > validator.value) {
          error = `Maximum value: ${validator.value}`;
        }
        break;
      }
      case FormFieldValidatorType.min: {
        if (validator.value && +value < validator.value) {
          error = `Minimum value: ${validator.value}`;
        }
        break;
      }
    }

    return error;
  }

  validateForm(): DynamicFormsErrors {
    const errors: DynamicFormsErrors = {};

    this.props.fields.forEach((field) => {
      const fieldError = this.validateField(field);
      if (fieldError) {
        errors[field.name] = fieldError;
      }
    });

    return errors;
  }
}

export default DynamicFormComponent;
