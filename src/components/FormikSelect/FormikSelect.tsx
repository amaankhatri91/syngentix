import React from "react";
import Select, { StylesConfig, GroupBase, OptionsOrGroups } from "react-select";
import useTheme from "@/utils/hooks/useTheme";
import { getReactSelectStyles } from "@/utils/common";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FormikSelectProps {
  /**
   * Field name from Formik
   */
  field: {
    name: string;
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
  };
  /**
   * Options for the select
   */
  options: SelectOption[];
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Formik errors object
   */
  errors?: any;
  /**
   * Formik touched object
   */
  touched?: any;
  /**
   * Whether to show error state
   */
  showError?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether the select is disabled
   */
  isDisabled?: boolean;
  /**
   * Callback when field is touched
   */
  onFieldTouched?: () => void;
  /**
   * Callback when field value changes
   */
  onFieldChange?: (value: SelectOption | null) => void;
  /**
   * Menu placement - 'top' or 'bottom' or 'auto'
   * Maps to react-select's menuPlacement prop
   */
  placement?: "top" | "bottom" | "auto";
  /**
   * Additional react-select props
   */
  [key: string]: any;
}

const FormikSelect: React.FC<FormikSelectProps> = ({
  field,
  options,
  placeholder = "Please Select",
  errors,
  touched,
  showError,
  className = "",
  isDisabled = false,
  onFieldTouched,
  onFieldChange,
  placement,
  ...props
}) => {
  const { isDark } = useTheme();
  const fieldName = field.name;
  const hasError =
    showError !== undefined
      ? showError
      : errors?.[fieldName] && touched?.[fieldName];

  // Convert field value to react-select format
  const selectedOption = options.find(
    (option) => option.value === field.value
  ) || null;

  const handleChange = (selectedOption: SelectOption | null) => {
    field.onChange(selectedOption ? selectedOption.value : "");
    if (onFieldChange) {
      onFieldChange(selectedOption);
    }
  };

  const handleBlur = () => {
    field.onBlur();
    if (onFieldTouched) {
      onFieldTouched();
    }
  };

  const customStyles = getReactSelectStyles(isDark, hasError);

  return (
    <div className={className}>
      <Select
        {...props}
        name={field.name}
        value={selectedOption}
        onChange={handleChange}
        onBlur={handleBlur}
        options={options}
        placeholder={placeholder}
        isDisabled={isDisabled}
        menuPlacement={placement || props.menuPlacement || "auto"}
        styles={customStyles as StylesConfig<SelectOption, false, GroupBase<SelectOption>>}
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default FormikSelect;

