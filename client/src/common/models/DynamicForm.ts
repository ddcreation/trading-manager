export const FormFieldValidatorType = {
  min: 'min' as const,
  max: 'max' as const,
  required: 'required' as const,
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FormFieldValidatorType = keyof typeof FormFieldValidatorType;

export const FormFieldType = {
  hidden: 'hidden' as const,
  numeric: 'numeric' as const,
  select: 'select' as const,
  text: 'text' as const,
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FormFieldType = keyof typeof FormFieldType;

export interface FormFieldValidator {
  type: FormFieldValidatorType;
  value?: string | number;
}

export interface FormFieldConfigOption {
  disabled?: boolean;
}

export interface FormFieldConfig {
  label: string;
  name: string;
  options?: FormFieldConfigOption;
  type: string;
  validators?: FormFieldValidator[];
  value?: any;
}

export interface DynamicForm {
  [k: string]: any;
}
